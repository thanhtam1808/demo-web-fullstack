import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-6px); }
`;
const Media  = styled(Link)`position: relative; display: block;`;
const Poster = styled.img`width: 100%; height: 300px; object-fit: cover;`;
const Badge  = styled.span`
  position: absolute; top: 14px; left: 14px;
  padding: 6px 12px; border-radius: 999px;
  background: rgba(255,255,255,0.88);
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.7rem; text-transform: uppercase;
  letter-spacing: 0.18em; color: ${({ theme }) => theme.colors.muted};
`;
const RatingBadge = styled.span`
  position: absolute; top: 14px; right: 14px;
  padding: 6px 10px; border-radius: 999px;
  background: rgba(255,255,255,0.88);
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem; font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryStrong};
`;
const Info = styled.div`padding: 18px; display: grid; gap: 10px;`;
const Title = styled.h3`margin: 0; font-size: 1.1rem;`;
const Meta  = styled.p`margin: 0; color: ${({ theme }) => theme.colors.muted}; font-size: 0.85rem;`;
const Actions  = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;
const ButtonLink = styled(Link)`
  flex: 1 1 120px; padding: 10px 14px; border-radius: 999px;
  font-weight: 600; text-align: center;
  transition: transform 0.2s ease;
  ${({ $variant, theme }) => $variant === "primary"
    ? `background: linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff; box-shadow:0 10px 30px rgba(255,111,177,0.3);`
    : `background:${theme.colors.bgAlt}; color:${theme.colors.text}; border:1px solid ${theme.colors.border};`}
  &:hover { transform: translateY(-2px); }
`;

const STATUS_LABEL = { showing: "Now Showing", upcoming: "Coming Soon", ended: "Past" };

function MovieCard({ movie }) {
  const meta = [movie.genre, movie.duration].filter(Boolean).join(" | ");
  // ── dùng _id thay vì id ──────────────────────────────
  const id   = movie._id;

  return (
    <Card>
      <Media to={`/movie/${id}`}>
        <Poster src={movie.poster} alt={movie.title} />
        <Badge>{STATUS_LABEL[movie.status] || "Now Showing"}</Badge>
        {movie.avgRating && <RatingBadge>⭐ {movie.avgRating}</RatingBadge>}
      </Media>

      <Info>
        <Title><Link to={`/movie/${id}`}>{movie.title}</Link></Title>
        {meta && <Meta>{meta}</Meta>}
        <Actions>
          <ButtonLink to={`/movie/${id}`}>View detail</ButtonLink>
          <ButtonLink $variant="primary" to={`/booking/${id}`}>Book now</ButtonLink>
        </Actions>
      </Info>
    </Card>
  );
}

export default MovieCard;
