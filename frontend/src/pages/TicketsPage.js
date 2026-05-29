import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styled from "styled-components";
import { bookingApi } from "../api/movieApi";

/* ── Styles ─────────────────────────────────────────── */
const Page       = styled.div`padding: 40px 6vw 90px;`;
const PageTitle  = styled.h2`font-family: "Playfair Display", serif; margin: 0 0 32px; font-size: clamp(1.8rem, 2vw + 1rem, 2.6rem);`;
const Grid       = styled.div`display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));`;

const TicketCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 28px; border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow}; overflow: hidden;
`;
const TicketTop  = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  padding: 20px 24px; color: #fff;
`;
const MovieTitle = styled.h3`margin: 0 0 4px; font-family: "Playfair Display", serif; font-size: 1.2rem;`;
const CinemaName = styled.p`margin: 0; font-size: 0.85rem; opacity: 0.85;`;

const TicketDivider = styled.div`
  display: flex; align-items: center;
  border-top: 2px dashed ${({ theme }) => theme.colors.border};
  margin: 0 16px; position: relative;
  &::before, &::after {
    content: ""; position: absolute; top: -12px; width: 20px; height: 20px;
    border-radius: 50%; background: ${({ theme }) => theme.colors.bgAlt};
  }
  &::before { left: -28px; }
  &::after  { right: -28px; }
`;

const TicketBody = styled.div`padding: 20px 24px; display: grid; gap: 14px;`;
const InfoGrid   = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const InfoItem   = styled.div``;
const InfoLabel  = styled.p`margin: 0 0 2px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: ${({ theme }) => theme.colors.muted};`;
const InfoValue  = styled.p`margin: 0; font-weight: 700; font-size: 0.95rem;`;

const SeatsWrap  = styled.div``;
const SeatTags   = styled.div`display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;`;
const SeatTag    = styled.span`
  padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700;
  background: ${({ theme }) => theme.colors.cardSoft}; border: 1px solid ${({ theme }) => theme.colors.border};
`;

const QrWrap     = styled.div`display: flex; justify-content: center; padding: 16px; border-radius: 18px; background: ${({ theme }) => theme.colors.cardSoft};`;
const TotalRow   = styled.div`display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid ${({ theme }) => theme.colors.border};`;
const TotalLabel = styled.span`color: ${({ theme }) => theme.colors.muted}; font-size: 0.9rem;`;
const TotalVal   = styled.strong`color: ${({ theme }) => theme.colors.primaryStrong}; font-size: 1.1rem;`;

const StatusBadge = styled.span`
  display: inline-block; padding: 4px 12px; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  ${({ $status }) =>
    $status === "confirmed"
      ? "background:rgba(100,200,100,0.15); color:green;"
      : "background:rgba(200,100,100,0.12); color:#c0392b;"}
`;

const EmptyWrap  = styled.div`text-align: center; padding: 80px 20px; color: ${({ theme }) => theme.colors.muted};`;
const EmptyIcon  = styled.div`font-size: 64px; margin-bottom: 16px;`;

function TicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    bookingApi.getMy()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Page><p>Loading your tickets...</p></Page>;

  return (
    <Page>
      <PageTitle>My Tickets</PageTitle>

      {bookings.length === 0 ? (
        <EmptyWrap>
          <EmptyIcon>🎟</EmptyIcon>
          <h3>No tickets yet</h3>
          <p>Book a movie to see your tickets here.</p>
        </EmptyWrap>
      ) : (
        <Grid>
          {bookings.map((b) => {
            const movie  = b.movieId;
            const cinema = b.cinemaId;
            const qrData = `MOONLIGHT|${b._id}|${movie?.title}|${b.seats?.join(",")}|${b.showDate} ${b.showTime}`;

            return (
              <TicketCard key={b._id}>
                <TicketTop>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <MovieTitle>{movie?.title || "Movie"}</MovieTitle>
                      <CinemaName>{cinema?.name || "Cinema"}</CinemaName>
                    </div>
                    <StatusBadge $status={b.status}>{b.status}</StatusBadge>
                  </div>
                </TicketTop>

                <TicketDivider />

                <TicketBody>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>Date</InfoLabel>
                      <InfoValue>{b.showDate}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Time</InfoLabel>
                      <InfoValue>{b.showTime}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Cinema</InfoLabel>
                      <InfoValue style={{ fontSize: "0.82rem" }}>{cinema?.location || "—"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Genre</InfoLabel>
                      <InfoValue style={{ fontSize: "0.82rem" }}>{movie?.genre || "—"}</InfoValue>
                    </InfoItem>
                  </InfoGrid>

                  <SeatsWrap>
                    <InfoLabel>Seats</InfoLabel>
                    <SeatTags>
                      {b.seats?.map((s) => <SeatTag key={s}>{s}</SeatTag>)}
                    </SeatTags>
                  </SeatsWrap>

                  <QrWrap>
                    <QRCodeCanvas value={qrData} size={120} />
                  </QrWrap>

                  <TotalRow>
                    <TotalLabel>{b.seats?.length} seat(s)</TotalLabel>
                    <TotalVal>{b.totalPrice?.toLocaleString("vi-VN")}đ</TotalVal>
                  </TotalRow>
                </TicketBody>
              </TicketCard>
            );
          })}
        </Grid>
      )}
    </Page>
  );
}

export default TicketsPage;
