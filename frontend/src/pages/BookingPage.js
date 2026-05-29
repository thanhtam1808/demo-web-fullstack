import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { movieApi, cinemaApi, bookingApi } from "../api/movieApi";

const Page = styled.div`
  padding: 30px 6vw 90px;
  display: grid;
  gap: 30px;
`;
const Title = styled.h2`
  margin: 0;
  font-family: "Playfair Display", serif;
  font-size: clamp(1.8rem, 2vw + 1rem, 2.6rem);
`;
const SubTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1rem;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(280px, 340px);
  gap: 32px;
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;
  background: ${({ theme }) => theme.colors.cardSoft};
  display: grid;
  gap: 18px;
`;
const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TimeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const TimeBtn = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  ${({ $active, theme }) =>
    $active
      ? `background:linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff; border-color:transparent;`
      : `background:${theme.colors.card}; color:${theme.colors.muted};`}
`;

const Screen = styled.div`
  margin: 0 auto;
  width: min(520px, 100%);
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, #fff, #ffd6e8, #fff);
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  display: grid;
  place-items: center;
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(36px, 1fr));
  gap: 8px;
  justify-content: center;
`;

const SeatBtn = styled.button`
  padding: 10px 0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: ${({ $taken }) => ($taken ? "not-allowed" : "pointer")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.15s;
  ${({ $taken, $selected, theme }) =>
    $taken
      ? `background:#eee; color:#bbb;`
      : $selected
        ? `background:linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff; border-color:transparent;`
        : `background:${theme.colors.card}; color:${theme.colors.text};`}
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;
const LegItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
`;
const LegDot = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
  ${({ $type, theme }) =>
    $type === "selected"
      ? `background:${theme.colors.primary};`
      : $type === "taken"
        ? `background:#eee; border:1px solid #ddd;`
        : `background:${theme.colors.card}; border:1px solid ${theme.colors.border};`}
`;

const Summary = styled.div`
  display: grid;
  gap: 12px;
`;
const SumRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;
const SumKey = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;
const SumVal = styled.span`
  font-weight: 600;
`;
const SumTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.05rem;
`;
const ConfirmBtn = styled.button`
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 700;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 12px 30px rgba(255, 111, 177, 0.3);
  transition: transform 0.2s;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const Msg = styled.p`
  font-size: 0.88rem;
  padding: 10px 14px;
  border-radius: 12px;
  margin: 0;
  ${({ $ok, theme }) =>
    $ok
      ? `background:rgba(100,200,100,0.1); color:green;`
      : `background:rgba(255,100,100,0.1); color:${theme.colors.primaryStrong};`}
`;

/* ── Helpers ─────────────────────────────────────────── */
const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = 8;
const PRICE = 85000;

// Giả lập ~20% ghế đã bán (random mỗi lần load)
const TAKEN_SEATS = new Set(
  Array.from({ length: ROWS.length * COLS }, (_, i) => {
    const row = ROWS[Math.floor(i / COLS)];
    const col = (i % COLS) + 1;
    return `${row}${col}`;
  }).filter(() => Math.random() < 0.2),
);

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [cinemaId, setCinemaId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    movieApi.getById(id).then(setMovie).catch(console.error);
    cinemaApi
      .getAll()
      .then((data) => {
        setCinemas(data);
        if (data.length) {
          setCinemaId(data[0]._id);
          setShowtimes(data[0].showtimes || []);
        }
      })
      .catch(console.error);

    // Default ngày = hôm nay
    const today = new Date().toISOString().split("T")[0];
    setShowDate(today);
  }, [id]);

  const handleCinemaChange = (cid) => {
    setCinemaId(cid);
    const found = cinemas.find((c) => c._id === cid);
    setShowtimes(found?.showtimes || []);
    setShowTime("");
  };

  const toggleSeat = (seat) => {
    if (TAKEN_SEATS.has(seat)) return;
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const handleConfirm = async () => {
    if (!cinemaId || !showDate || !showTime)
      return setMsg({
        text: "Vui lòng chọn rạp, ngày và suất chiếu",
        ok: false,
      });
    if (!selected.length)
      return setMsg({ text: "Vui lòng chọn ít nhất 1 ghế", ok: false });

    setLoading(true);
    setMsg(null);
    try {
      await bookingApi.create({
        movieId: id,
        cinemaId,
        showDate,
        showTime,
        seats: selected,
      });
      setMsg({ text: "Đặt vé thành công! Đang chuyển trang...", ok: true });
      setTimeout(() => navigate("/tickets"), 1500);
    } catch (err) {
      setMsg({
        text: err.message || "Đặt vé thất bại. Thử lại nhé!",
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selected.length * PRICE;

  return (
    <Page>
      <div>
        <Title>Select your seat</Title>
        {movie && <SubTitle>{movie.title}</SubTitle>}
      </div>

      <Grid2>
        {/* ── Left: Cinema + Seat map ── */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Chọn rạp & suất */}
          <Panel>
            <PanelTitle>Choose cinema & showtime</PanelTitle>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "gray",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Cinema
              </label>
              <Select
                value={cinemaId}
                onChange={(e) => handleCinemaChange(e.target.value)}
              >
                {cinemas.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.location}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "gray",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Date
              </label>
              <Select
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const val = d.toISOString().split("T")[0];
                  return (
                    <option key={val} value={val}>
                      {d.toLocaleDateString("vi-VN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "gray",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Showtime
              </label>
              <TimeGrid>
                {showtimes.map((t) => (
                  <TimeBtn
                    key={t}
                    $active={showTime === t}
                    onClick={() => setShowTime(t)}
                  >
                    {t}
                  </TimeBtn>
                ))}
              </TimeGrid>
            </div>
          </Panel>

          {/* Sơ đồ ghế */}
          <Panel>
            <PanelTitle>Seat map</PanelTitle>
            <Screen>SCREEN</Screen>
            <SeatGrid>
              {ROWS.map((row) =>
                Array.from({ length: COLS }, (_, i) => {
                  const seat = `${row}${i + 1}`;
                  const taken = TAKEN_SEATS.has(seat);
                  const isSel = selected.includes(seat);
                  return (
                    <SeatBtn
                      key={seat}
                      $taken={taken}
                      $selected={isSel}
                      disabled={taken}
                      onClick={() => toggleSeat(seat)}
                      title={seat}
                    >
                      {seat}
                    </SeatBtn>
                  );
                }),
              )}
            </SeatGrid>
            <Legend>
              <LegItem>
                <LegDot $type="available" />
                Available
              </LegItem>
              <LegItem>
                <LegDot $type="selected" />
                Selected
              </LegItem>
              <LegItem>
                <LegDot $type="taken" />
                Taken
              </LegItem>
            </Legend>
          </Panel>
        </div>

        {/* ── Right: Summary ── */}
        <Panel style={{ alignSelf: "start", position: "sticky", top: 80 }}>
          <PanelTitle>Booking summary</PanelTitle>
          <Summary>
            <SumRow>
              <SumKey>Movie</SumKey>
              <SumVal>{movie?.title || "—"}</SumVal>
            </SumRow>
            <SumRow>
              <SumKey>Cinema</SumKey>
              <SumVal
                style={{
                  textAlign: "right",
                  maxWidth: 160,
                  fontSize: "0.85rem",
                }}
              >
                {cinemas.find((c) => c._id === cinemaId)?.name || "—"}
              </SumVal>
            </SumRow>
            <SumRow>
              <SumKey>Date</SumKey>
              <SumVal>{showDate || "—"}</SumVal>
            </SumRow>
            <SumRow>
              <SumKey>Time</SumKey>
              <SumVal>{showTime || "—"}</SumVal>
            </SumRow>
            <SumRow>
              <SumKey>Seats</SumKey>
              <SumVal>{selected.length ? selected.join(", ") : "None"}</SumVal>
            </SumRow>
            <SumRow>
              <SumKey>Price / seat</SumKey>
              <SumVal>{PRICE.toLocaleString("vi-VN")}đ</SumVal>
            </SumRow>
            <SumTotal>
              <strong>Total</strong>
              <strong style={{ color: "#d63384" }}>
                {totalPrice.toLocaleString("vi-VN")}đ
              </strong>
            </SumTotal>
          </Summary>

          {msg && <Msg $ok={msg.ok}>{msg.text}</Msg>}

          <ConfirmBtn onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm booking"}
          </ConfirmBtn>
        </Panel>
      </Grid2>
    </Page>
  );
}

export default BookingPage;
