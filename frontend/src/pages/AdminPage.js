import { useState, useEffect } from "react";
import styled from "styled-components";
import { movieApi, cinemaApi, adminApi } from "../api/movieApi";

/* ── Layout ─────────────────────────────────────────── */
const Page     = styled.div`display: flex; min-height: calc(100vh - 64px);`;
const Sidebar  = styled.aside`
  width: 220px; flex-shrink: 0; padding: 28px 0;
  background: ${({ theme }) => theme.colors.cardSoft};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; flex-direction: column; gap: 4px;
`;
const SideTitle = styled.p`
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em;
  color: ${({ theme }) => theme.colors.muted}; padding: 0 20px; margin: 0 0 12px;
`;
const SideBtn  = styled.button`
  padding: 10px 20px; text-align: left; background: none; border: none;
  font-weight: 600; font-size: 0.95rem; cursor: pointer;
  border-left: 3px solid transparent; transition: all 0.15s;
  color: ${({ $active, theme }) => $active ? theme.colors.primaryStrong : theme.colors.muted};
  background: ${({ $active, theme }) => $active ? theme.colors.card : "transparent"};
  border-left-color: ${({ $active, theme }) => $active ? theme.colors.primary : "transparent"};
  &:hover { color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.card}; }
`;
const Main     = styled.main`flex: 1; padding: 32px 36px; overflow: auto;`;
const SecTitle = styled.h2`font-family: "Playfair Display", serif; font-size: 1.8rem; margin: 0 0 24px;`;

/* ── Shared table ────────────────────────────────────── */
const Table    = styled.div`
  background: ${({ theme }) => theme.colors.card}; border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border}; overflow: auto;
`;
const THead    = styled.div`
  display: grid; padding: 12px 20px;
  background: ${({ theme }) => theme.colors.cardSoft};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px 20px 0 0;
`;
const TRow     = styled.div`
  display: grid; padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.cardSoft}; }
`;
const TCell    = styled.span`font-size: 0.9rem;`;
const TCellMuted = styled(TCell)`color: ${({ theme }) => theme.colors.muted}; font-size: 0.82rem;`;
const ActionRow = styled.div`display: flex; gap: 8px;`;
const Btn      = styled.button`
  padding: 6px 14px; border-radius: 999px; font-weight: 600;
  font-size: 0.8rem; cursor: pointer; border: 1px solid transparent; transition: all 0.15s;
  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `background:linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff;`
      : $variant === "danger"
      ? `background:rgba(214,51,132,0.1); color:${theme.colors.primaryStrong}; border-color:${theme.colors.primary};`
      : `background:${theme.colors.cardSoft}; color:${theme.colors.text}; border-color:${theme.colors.border};`}
  &:hover { transform: translateY(-1px); }
`;
const Badge    = styled.span`
  display:inline-block; padding:3px 10px; border-radius:999px; font-size:0.75rem; font-weight:700;
  ${({ $status }) =>
    $status === "showing"  ? "background:rgba(100,200,100,0.12); color:green;" :
    $status === "upcoming" ? "background:rgba(255,180,50,0.15); color:#b8860b;" :
                              "background:rgba(150,150,150,0.12); color:gray;"}
`;

/* ── Stats ───────────────────────────────────────────── */
const StatsGrid = styled.div`display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; margin-bottom:32px;`;
const StatCard  = styled.div`
  border-radius:20px; border: 1px solid ${({ theme }) => theme.colors.border};
  padding:20px; background:${({ theme }) => theme.colors.card};
  border-top:3px solid ${({ color }) => color || "#ccc"};
`;
const StatNum   = styled.div`font-family:"Playfair Display",serif; font-size:2rem; color:${({ color }) => color};`;
const StatLabel = styled.div`color:${({ theme }) => theme.colors.muted}; font-size:0.85rem; margin-top:4px;`;

/* ── Movie form modal ────────────────────────────────── */
const Overlay  = styled.div`position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:50; display:grid; place-items:center; padding:20px;`;
const Modal    = styled.div`
  background:${({ theme }) => theme.colors.card}; border-radius:24px;
  padding:28px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto;
  border:1px solid ${({ theme }) => theme.colors.border}; box-shadow:0 20px 60px rgba(0,0,0,0.15);
`;
const ModalTitle = styled.h3`margin:0 0 20px; font-family:"Playfair Display",serif;`;
const FormGrid = styled.div`display:grid; grid-template-columns:1fr 1fr; gap:14px;`;
const FGroup   = styled.div`display:grid; gap:5px; ${({ $full }) => $full ? "grid-column:1/-1;" : ""}`;
const FLabel   = styled.label`font-size:0.78rem; text-transform:uppercase; letter-spacing:0.1em; color:${({ theme }) => theme.colors.muted}; font-weight:600;`;
const FInput   = styled.input`
  padding:10px 14px; border-radius:12px; border:1px solid ${({ theme }) => theme.colors.border};
  background:${({ theme }) => theme.colors.cardSoft}; font-family:inherit; font-size:0.9rem; outline:none;
  &:focus { border-color:${({ theme }) => theme.colors.primary}; }
`;
const FSelect  = styled.select`
  padding:10px 14px; border-radius:12px; border:1px solid ${({ theme }) => theme.colors.border};
  background:${({ theme }) => theme.colors.cardSoft}; font-family:inherit; font-size:0.9rem; outline:none;
`;
const FTextarea = styled.textarea`
  padding:10px 14px; border-radius:12px; border:1px solid ${({ theme }) => theme.colors.border};
  background:${({ theme }) => theme.colors.cardSoft}; font-family:inherit; font-size:0.9rem;
  resize:vertical; outline:none; grid-column:1/-1;
  &:focus { border-color:${({ theme }) => theme.colors.primary}; }
`;
const ModalActions = styled.div`display:flex; gap:10px; margin-top:20px;`;

const EMPTY_MOVIE = { title:"", description:"", poster:"", banner:"", genre:"", duration:"", language:"", releaseDate:"", trailer:"", status:"showing" };

/* ══════════════════════════════════════════════════════ */
function AdminPage() {
  const [tab,      setTab]      = useState("dashboard");
  const [stats,    setStats]    = useState(null);
  const [movies,   setMovies]   = useState([]);
  const [cinemas,  setCinemas]  = useState([]);
  const [users,    setUsers]    = useState([]);
  const [modal,    setModal]    = useState(false);
  const [editData, setEditData] = useState(EMPTY_MOVIE);
  const [editId,   setEditId]   = useState(null);

  const load = {
    stats:   () => adminApi.getStats().then(setStats).catch(console.error),
    movies:  () => movieApi.getAll().then(setMovies).catch(console.error),
    cinemas: () => cinemaApi.getAll().then(setCinemas).catch(console.error),
    users:   () => adminApi.getUsers().then(setUsers).catch(console.error),
  };

  useEffect(() => { load.stats(); load.movies(); load.cinemas(); load.users(); }, []);

  const openAdd  = () => { setEditId(null); setEditData(EMPTY_MOVIE); setModal(true); };
  const openEdit = (m) => { setEditId(m._id); setEditData({ ...m }); setModal(true); };

  const saveMovie = async () => {
    try {
      if (editId) await movieApi.update(editId, editData);
      else        await movieApi.create(editData);
      setModal(false);
      load.movies();
    } catch (err) { alert(err.message); }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm("Xoá phim này?")) return;
    await movieApi.delete(id).catch(console.error);
    load.movies();
  };

  const toggleUser = async (id) => {
    await adminApi.toggleUser(id).catch(console.error);
    load.users();
  };

  return (
    <Page>
      <Sidebar>
        <SideTitle>Admin Panel</SideTitle>
        {[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "movies",    label: "🎬 Movies" },
          { key: "cinemas",   label: "🏢 Cinemas" },
          { key: "users",     label: "👥 Users" },
        ].map(({ key, label }) => (
          <SideBtn key={key} $active={tab === key} onClick={() => setTab(key)}>{label}</SideBtn>
        ))}
      </Sidebar>

      <Main>
        {/* ── Dashboard ── */}
        {tab === "dashboard" && stats && (
          <div>
            <SecTitle>Dashboard</SecTitle>
            <StatsGrid>
              <StatCard color="#d63384"><StatNum color="#d63384">{stats.userCount}</StatNum><StatLabel>Customers</StatLabel></StatCard>
              <StatCard color="#6f42c1"><StatNum color="#6f42c1">{stats.movieCount}</StatNum><StatLabel>Movies</StatLabel></StatCard>
              <StatCard color="#0d6efd"><StatNum color="#0d6efd">{stats.cinemaCount}</StatNum><StatLabel>Cinemas</StatLabel></StatCard>
              <StatCard color="#198754"><StatNum color="#198754">{stats.bookingCount}</StatNum><StatLabel>Bookings</StatLabel></StatCard>
              <StatCard color="#fd7e14" style={{ gridColumn: "span 2" }}>
                <StatNum color="#fd7e14">{stats.revenue?.toLocaleString("vi-VN")}đ</StatNum>
                <StatLabel>Total Revenue</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>
        )}

        {/* ── Movies ── */}
        {tab === "movies" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <SecTitle style={{ margin:0 }}>Movies ({movies.length})</SecTitle>
              <Btn $variant="primary" onClick={openAdd}>+ Add movie</Btn>
            </div>
            <Table>
              <THead style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr 120px" }}>
                {["Title","Genre","Duration","Status","Actions"].map(h => <TCellMuted key={h} style={{ fontWeight:700 }}>{h}</TCellMuted>)}
              </THead>
              {movies.map((m) => (
                <TRow key={m._id} style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr 120px" }}>
                  <div>
                    <TCell style={{ fontWeight:600 }}>{m.title}</TCell>
                    {m.avgRating && <TCellMuted style={{ display:"block" }}>⭐ {m.avgRating}</TCellMuted>}
                  </div>
                  <TCellMuted>{m.genre || "—"}</TCellMuted>
                  <TCellMuted>{m.duration || "—"}</TCellMuted>
                  <Badge $status={m.status}>{m.status}</Badge>
                  <ActionRow>
                    <Btn onClick={() => openEdit(m)}>✏</Btn>
                    <Btn $variant="danger" onClick={() => deleteMovie(m._id)}>🗑</Btn>
                  </ActionRow>
                </TRow>
              ))}
            </Table>
          </div>
        )}

        {/* ── Cinemas ── */}
        {tab === "cinemas" && (
          <div>
            <SecTitle>Cinemas ({cinemas.length})</SecTitle>
            <Table>
              <THead style={{ gridTemplateColumns:"2fr 2fr 1fr" }}>
                {["Name","Location","Seats"].map(h => <TCellMuted key={h} style={{ fontWeight:700 }}>{h}</TCellMuted>)}
              </THead>
              {cinemas.map((c) => (
                <TRow key={c._id} style={{ gridTemplateColumns:"2fr 2fr 1fr" }}>
                  <TCell style={{ fontWeight:600 }}>{c.name}</TCell>
                  <TCellMuted>{c.location}</TCellMuted>
                  <TCellMuted>{c.seats}</TCellMuted>
                </TRow>
              ))}
            </Table>
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div>
            <SecTitle>Users ({users.filter(u => u.role==="customer").length} customers)</SecTitle>
            <Table>
              <THead style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 100px" }}>
                {["Name","Email","Role","Bookings","Action"].map(h => <TCellMuted key={h} style={{ fontWeight:700 }}>{h}</TCellMuted>)}
              </THead>
              {users.map((u) => (
                <TRow key={u._id} style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 100px" }}>
                  <TCell style={{ fontWeight:600 }}>{u.name || "—"}</TCell>
                  <TCellMuted>{u.email}</TCellMuted>
                  <TCell style={{ color: u.role==="admin" ? "#d63384" : "inherit", fontSize:"0.85rem", fontWeight:600 }}>{u.role}</TCell>
                  <TCellMuted>{u.bookingCount}</TCellMuted>
                  {u.role !== "admin" ? (
                    <Btn $variant={u.isActive ? "danger" : ""} onClick={() => toggleUser(u._id)}>
                      {u.isActive ? "Lock" : "Unlock"}
                    </Btn>
                  ) : <span />}
                </TRow>
              ))}
            </Table>
          </div>
        )}
      </Main>

      {/* ── Movie Form Modal ── */}
      {modal && (
        <Overlay onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <Modal>
            <ModalTitle>{editId ? "Edit movie" : "Add new movie"}</ModalTitle>
            <FormGrid>
              {[
                { key:"title",       label:"Title *",         full:true },
                { key:"genre",       label:"Genre" },
                { key:"duration",    label:"Duration (e.g. 125 min)" },
                { key:"language",    label:"Language" },
                { key:"releaseDate", label:"Release year" },
                { key:"poster",      label:"Poster URL",      full:true },
                { key:"banner",      label:"Banner URL",      full:true },
                { key:"trailer",     label:"Trailer URL",     full:true },
              ].map(({ key, label, full }) => (
                <FGroup key={key} $full={full}>
                  <FLabel>{label}</FLabel>
                  <FInput
                    value={editData[key] || ""}
                    onChange={(e) => setEditData((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={label}
                  />
                </FGroup>
              ))}
              <FGroup>
                <FLabel>Status</FLabel>
                <FSelect value={editData.status} onChange={(e) => setEditData((p) => ({ ...p, status: e.target.value }))}>
                  <option value="showing">Now Showing</option>
                  <option value="upcoming">Coming Soon</option>
                  <option value="ended">Ended</option>
                </FSelect>
              </FGroup>
              <FGroup $full>
                <FLabel>Description</FLabel>
                <FTextarea rows={4} value={editData.description || ""} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} />
              </FGroup>
            </FormGrid>
            <ModalActions>
              <Btn $variant="primary" onClick={saveMovie}>Save</Btn>
              <Btn onClick={() => setModal(false)}>Cancel</Btn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}

export default AdminPage;
