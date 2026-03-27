import { Hono } from "hono";

type MemberClass = "Primarios" | "Infantil" | "Adolescentes" | "Jovens" | "Adultos";

type Bindings = {
  DB: D1Database;
  BIBLE_LIBRARY: R2Bucket;
  CORS_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const CLASSES: MemberClass[] = ["Primarios", "Infantil", "Adolescentes", "Jovens", "Adultos"];

app.use("*", async (c, next) => {
  await next();
  c.header("Access-Control-Allow-Origin", c.env.CORS_ORIGIN || "*");
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
});

app.options("*", (c) => c.body(null, 204));

app.get("/", (c) => c.json({ name: "Clemens Worker", status: "ok" }));

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json<{ clientName: string; password: string }>();
  if (!body?.clientName || !body?.password) {
    return c.json({ message: "Nome do Cliente e Senha são obrigatórios." }, 400);
  }

  const row = await c.env.DB.prepare(
    "SELECT id, full_name, client_name FROM users WHERE client_name = ?1 AND password = ?2 AND is_active = 1 LIMIT 1"
  )
    .bind(body.clientName, body.password)
    .first<{ id: number; full_name: string; client_name: string }>();

  if (!row) {
    return c.json({ message: "Credenciais inválidas." }, 401);
  }

  return c.json({
    user: {
      id: row.id,
      fullName: row.full_name,
      clientName: row.client_name
    }
  });
});

app.get("/api/members", async (c) => {
  const className = c.req.query("className");

  if (className && !CLASSES.includes(className as MemberClass)) {
    return c.json({ message: "Classe inválida." }, 400);
  }

  const sql = className
    ? "SELECT id, full_name, birth_date, address, phone, joined_at, baptized_at, class_name FROM members WHERE class_name = ?1 ORDER BY full_name"
    : "SELECT id, full_name, birth_date, address, phone, joined_at, baptized_at, class_name FROM members ORDER BY class_name, full_name";

  const members = className
    ? await c.env.DB.prepare(sql).bind(className).all()
    : await c.env.DB.prepare(sql).all();

  return c.json({ members: members.results ?? [] });
});

app.post("/api/members", async (c) => {
  const body = await c.req.json<{
    full_name: string;
    birth_date: string;
    address: string;
    phone: string;
    joined_at: string;
    baptized_at: string;
    class_name: MemberClass;
  }>();

  const required = [body.full_name, body.birth_date, body.address, body.phone, body.joined_at, body.baptized_at, body.class_name];
  if (required.some((value) => !value)) {
    return c.json({ message: "Todos os campos de membro são obrigatórios." }, 400);
  }

  if (!CLASSES.includes(body.class_name)) {
    return c.json({ message: "Classe inválida." }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO members (full_name, birth_date, address, phone, joined_at, baptized_at, class_name)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
  )
    .bind(body.full_name, body.birth_date, body.address, body.phone, body.joined_at, body.baptized_at, body.class_name)
    .run();

  return c.json({ ok: true });
});

app.put("/api/members/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ message: "ID inválido." }, 400);

  const body = await c.req.json<{
    full_name: string;
    birth_date: string;
    address: string;
    phone: string;
    joined_at: string;
    baptized_at: string;
    class_name: MemberClass;
  }>();

  await c.env.DB.prepare(
    `UPDATE members
     SET full_name = ?1, birth_date = ?2, address = ?3, phone = ?4, joined_at = ?5, baptized_at = ?6, class_name = ?7, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?8`
  )
    .bind(body.full_name, body.birth_date, body.address, body.phone, body.joined_at, body.baptized_at, body.class_name, id)
    .run();

  return c.json({ ok: true });
});

app.delete("/api/members/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ message: "ID inválido." }, 400);

  await c.env.DB.prepare("DELETE FROM members WHERE id = ?1").bind(id).run();
  return c.json({ ok: true });
});

app.post("/api/attendance/register", async (c) => {
  const body = await c.req.json<{
    sundayDate: string;
    className: MemberClass;
    offeringAmount: number;
    records: Array<{ memberId: number; present: boolean; chaptersRead: number }>;
  }>();

  if (!body?.sundayDate || !body?.className || !Array.isArray(body.records)) {
    return c.json({ message: "Payload de chamada inválido." }, 400);
  }

  if (!CLASSES.includes(body.className)) {
    return c.json({ message: "Classe inválida." }, 400);
  }

  const statements: D1PreparedStatement[] = body.records.map((row) =>
    c.env.DB.prepare(
      `INSERT INTO attendance_records (sunday_date, class_name, member_id, present, chapters_read)
       VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT (sunday_date, class_name, member_id)
       DO UPDATE SET present = excluded.present, chapters_read = excluded.chapters_read, updated_at = CURRENT_TIMESTAMP`
    ).bind(body.sundayDate, body.className, row.memberId, row.present ? 1 : 0, row.chaptersRead || 0)
  );

  statements.push(
    c.env.DB.prepare(
      `INSERT INTO offerings (sunday_date, class_name, amount)
       VALUES (?1, ?2, ?3)
       ON CONFLICT (sunday_date, class_name)
       DO UPDATE SET amount = excluded.amount, updated_at = CURRENT_TIMESTAMP`
    ).bind(body.sundayDate, body.className, Number(body.offeringAmount || 0))
  );

  await c.env.DB.batch(statements);

  return c.json({ ok: true });
});

app.get("/api/offerings/total", async (c) => {
  const sundayDate = c.req.query("sundayDate");
  const className = c.req.query("className");

  let row: { total: number } | null = null;
  if (sundayDate && className) {
    row = await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings WHERE sunday_date = ?1 AND class_name = ?2")
      .bind(sundayDate, className)
      .first<{ total: number }>();
  } else if (sundayDate) {
    row = await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings WHERE sunday_date = ?1")
      .bind(sundayDate)
      .first<{ total: number }>();
  } else {
    row = await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings").first<{ total: number }>();
  }

  return c.json({ total: Number(row?.total ?? 0) });
});

app.get("/api/reports/sunday", async (c) => {
  const sundayDate = c.req.query("sundayDate");
  const className = c.req.query("className");

  if (!sundayDate) {
    return c.json({ message: "sundayDate é obrigatório." }, 400);
  }

  const attendance = className
    ? await c.env.DB.prepare(
        `SELECT
           SUM(CASE WHEN present = 1 THEN 1 ELSE 0 END) AS present,
           SUM(CASE WHEN present = 0 THEN 1 ELSE 0 END) AS absent,
           SUM(chapters_read) AS chapters
         FROM attendance_records
         WHERE sunday_date = ?1 AND class_name = ?2`
      )
        .bind(sundayDate, className)
        .first<{ present: number; absent: number; chapters: number }>()
    : await c.env.DB.prepare(
        `SELECT
           SUM(CASE WHEN present = 1 THEN 1 ELSE 0 END) AS present,
           SUM(CASE WHEN present = 0 THEN 1 ELSE 0 END) AS absent,
           SUM(chapters_read) AS chapters
         FROM attendance_records
         WHERE sunday_date = ?1`
      )
        .bind(sundayDate)
        .first<{ present: number; absent: number; chapters: number }>();

  const offering = className
    ? await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings WHERE sunday_date = ?1 AND class_name = ?2")
        .bind(sundayDate, className)
        .first<{ total: number }>()
    : await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings WHERE sunday_date = ?1")
        .bind(sundayDate)
        .first<{ total: number }>();

  return c.json({
    sundayDate,
    className: className ?? null,
    totalPresent: Number(attendance?.present ?? 0),
    totalAbsent: Number(attendance?.absent ?? 0),
    totalChapters: Number(attendance?.chapters ?? 0),
    totalOfferings: Number(offering?.total ?? 0)
  });
});

app.get("/api/reports/annual", async (c) => {
  const year = Number(c.req.query("year") || new Date().getFullYear());
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const attendance = await c.env.DB.prepare(
    `SELECT
       SUM(CASE WHEN present = 1 THEN 1 ELSE 0 END) AS present,
       SUM(CASE WHEN present = 0 THEN 1 ELSE 0 END) AS absent,
       SUM(chapters_read) AS chapters
     FROM attendance_records
     WHERE sunday_date BETWEEN ?1 AND ?2`
  )
    .bind(start, end)
    .first<{ present: number; absent: number; chapters: number }>();

  const offerings = await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM offerings WHERE sunday_date BETWEEN ?1 AND ?2")
    .bind(start, end)
    .first<{ total: number }>();

  return c.json({
    totalPresent: Number(attendance?.present ?? 0),
    totalAbsent: Number(attendance?.absent ?? 0),
    totalOfferings: Number(offerings?.total ?? 0),
    totalChapters: Number(attendance?.chapters ?? 0)
  });
});

app.get("/api/reports/chapters-series", async (c) => {
  const year = Number(c.req.query("year") || new Date().getFullYear());
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const result = await c.env.DB.prepare(
    `SELECT sunday_date AS sundayDate, COALESCE(SUM(chapters_read), 0) AS chapters
     FROM attendance_records
     WHERE sunday_date BETWEEN ?1 AND ?2
     GROUP BY sunday_date
     ORDER BY sunday_date ASC`
  )
    .bind(start, end)
    .all<{ sundayDate: string; chapters: number }>();

  return c.json({
    points: (result.results ?? []).map((row) => ({
      sundayDate: row.sundayDate,
      chapters: Number(row.chapters)
    }))
  });
});

app.post("/api/meeting-minutes", async (c) => {
  const body = await c.req.json<{ meeting_date: string; meeting_type: "ordinaria" | "extraordinaria"; title: string; body: string }>();
  await c.env.DB.prepare(
    `INSERT INTO meeting_minutes (meeting_date, meeting_type, title, body)
     VALUES (?1, ?2, ?3, ?4)`
  )
    .bind(body.meeting_date, body.meeting_type, body.title, body.body)
    .run();

  return c.json({ ok: true });
});

app.get("/api/meeting-minutes", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, meeting_date, meeting_type, title, body, created_at, updated_at FROM meeting_minutes ORDER BY meeting_date DESC"
  ).all();

  return c.json({ records: result.results ?? [] });
});

app.post("/api/agenda-events", async (c) => {
  const body = await c.req.json<{
    title: string;
    description?: string;
    location?: string;
    starts_at: string;
    recurrence_rule?: string;
  }>();

  await c.env.DB.prepare(
    `INSERT INTO agenda_events (title, description, location, starts_at, recurrence_rule)
     VALUES (?1, ?2, ?3, ?4, ?5)`
  )
    .bind(body.title, body.description ?? null, body.location ?? null, body.starts_at, body.recurrence_rule ?? null)
    .run();

  return c.json({ ok: true });
});

app.get("/api/agenda-events", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, title, description, location, starts_at, recurrence_rule, google_event_id FROM agenda_events ORDER BY starts_at DESC"
  ).all();

  return c.json({ events: result.results ?? [] });
});

app.get("/api/library/files", async (c) => {
  const objects = await c.env.BIBLE_LIBRARY.list({ prefix: "books/" });
  return c.json({
    files: objects.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded
    }))
  });
});

app.post("/api/library/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ message: "Envie um arquivo PDF no campo 'file'." }, 400);
  }

  const key = `books/${Date.now()}-${file.name}`;
  await c.env.BIBLE_LIBRARY.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/pdf" }
  });

  return c.json({ ok: true, key });
});

export default app;
