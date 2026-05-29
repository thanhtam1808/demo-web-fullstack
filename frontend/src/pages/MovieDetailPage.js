import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { movieApi, ratingApi } from "../api/movieApi";
import { useAuth } from "../context/AuthContext";

const Page = styled.div`
  padding: 30px 6vw 90px;
`;

const Hero = styled.div`
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  margin: 20px 0 40px;
  box-shadow: ${({ theme }) => theme.shadow};
`;
const HeroScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 240, 246, 0.2),
    rgba(255, 240, 246, 0.9)
  );
`;
const Content = styled.div`
  display: grid;
  gap: 50px;
`;
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 320px) 1fr;
  gap: 40px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const PosterWrap = styled.div`
  display: grid;
  gap: 16px;
`;
const Poster = styled.img`
  width: 100%;
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
`;
const Actions = styled.div`
  display: grid;
  gap: 12px;
`;
const ButtonLink = styled(Link)`
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 600;
  text-align: center;
  border: 1px solid transparent;
  transition: transform 0.2s ease;
  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `background: linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff; box-shadow:0 12px 30px rgba(255,111,177,0.3);`
      : `background:${theme.colors.cardSoft}; color:${theme.colors.text}; border:1px solid ${theme.colors.border};`}
  &:hover {
    transform: translateY(-2px);
  }
`;
const Info = styled.div`
  display: grid;
  gap: 18px;
`;
const Eyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.32em;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.7rem;
  margin-bottom: 6px;
`;
const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: clamp(2.2rem, 3vw, 3rem);
  margin: 0;
`;
const Description = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.7;
  margin: 0;
`;
const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
`;
const MetaCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px;
  background: ${({ theme }) => theme.colors.cardSoft};
  display: grid;
  gap: 6px;
  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: ${({ theme }) => theme.colors.muted};
  }
  strong {
    font-size: 1rem;
  }
`;
const TrailerSection = styled.div`
  display: grid;
  gap: 20px;
`;
const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
`;
const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
`;
const TrailerFrame = styled.div`
  position: relative;
  padding-top: 56.25%;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow};
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

/* ── Rating section styles ───────────────────────────── */
const RatingSection = styled.div`
  display: grid;
  gap: 20px;
`;
const RatingForm = styled.div`
  background: ${({ theme }) => theme.colors.cardSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 24px;
  display: grid;
  gap: 14px;
`;
const RatingLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
`;
const RangeInput = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.colors.primary};
`;
const Textarea = styled.textarea`
  width: 100%;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px;
  background: ${({ theme }) => theme.colors.card};
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const SubmitBtn = styled.button`
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  color: #fff;
  width: fit-content;
`;
const ReviewList = styled.div`
  display: grid;
  gap: 12px;
`;
const ReviewCard = styled.div`
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.cardSoft};
`;
const ReviewMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const ReviewName = styled.strong`
  font-size: 0.95rem;
`;
const ReviewScore = styled.span`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
`;
const ReviewComment = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
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

function getEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([\w-]+)/i);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([\w-]+)/i);
  if (long?.[1]) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
}

function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [score, setScore] = useState(8);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState(null); // { text, ok }

  const fetchMovie = () =>
    movieApi.getById(id).then(setMovie).catch(console.error);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const submitRating = async () => {
    try {
      await ratingApi.create({ movieId: id, score, comment });
      setMsg({ text: "Cảm ơn bạn đã đánh giá! 🎉", ok: true });
      setComment("");
      fetchMovie(); // refresh ratings
    } catch (err) {
      setMsg({ text: err.message || "Gửi đánh giá thất bại", ok: false });
    }
  };

  if (!movie)
    return (
      <Page>
        <p>Loading...</p>
      </Page>
    );

  const backdropImage = movie.banner || movie.poster;
  const metaItems = [
    movie.genre && { label: "Genre", value: movie.genre },
    movie.duration && { label: "Duration", value: movie.duration },
    movie.language && { label: "Language", value: movie.language },
    movie.releaseDate && { label: "Release", value: movie.releaseDate },
    movie.avgRating && { label: "Rating", value: `⭐ ${movie.avgRating} / 10` },
  ].filter(Boolean);

  return (
    <Page>
      <Hero style={{ backgroundImage: `url(${backdropImage})` }}>
        <HeroScrim />
      </Hero>

      <Content>
        <DetailGrid>
          <PosterWrap>
            <Poster src={movie.poster} alt={movie.title} />
            <Actions>
              {/* dùng _id từ MongoDB */}
              <ButtonLink $variant="primary" to={`/booking/${movie._id}`}>
                Book ticket
              </ButtonLink>
              <ButtonLink to="/">Back to home</ButtonLink>
            </Actions>
          </PosterWrap>

          <Info>
            <Eyebrow>Movie detail</Eyebrow>
            <Title>{movie.title}</Title>
            <Description>{movie.description}</Description>
            {metaItems.length > 0 && (
              <MetaGrid>
                {metaItems.map((item) => (
                  <MetaCard key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </MetaCard>
                ))}
              </MetaGrid>
            )}
          </Info>
        </DetailGrid>

        {/* Trailer */}
        {movie.trailer && (
          <TrailerSection>
            <SectionHead>
              <div>
                <Eyebrow>Watch before booking</Eyebrow>
                <SectionTitle>Trailer</SectionTitle>
              </div>
            </SectionHead>
            <TrailerFrame>
              <iframe
                src={getEmbedUrl(movie.trailer)}
                title="trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </TrailerFrame>
          </TrailerSection>
        )}

        {/* Rating */}
        <RatingSection>
          <SectionHead>
            <div>
              <Eyebrow>What viewers think</Eyebrow>
              <SectionTitle>Ratings & Reviews</SectionTitle>
            </div>
          </SectionHead>

          {/* Form chỉ hiện nếu đã login */}
          {user?.role === "customer" && (
            <RatingForm>
              <RatingLabel>Your score: {score} / 10</RatingLabel>
              <RangeInput
                type="range"
                min={1}
                max={10}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
              <Textarea
                rows={3}
                placeholder="Share your thoughts (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {msg && <Msg $ok={msg.ok}>{msg.text}</Msg>}
              <SubmitBtn onClick={submitRating}>Submit review</SubmitBtn>
            </RatingForm>
          )}

          {!user && (
            <Msg $ok={false}>
              <Link to="/login" style={{ color: "inherit", fontWeight: 600 }}>
                Login
              </Link>{" "}
              to leave a review.
            </Msg>
          )}

          {/* Danh sách reviews */}
          {movie.ratings?.length > 0 && (
            <ReviewList>
              {movie.ratings.map((r) => (
                <ReviewCard key={r._id}>
                  <ReviewMeta>
                    <ReviewName>{r.customerId?.name || "Anonymous"}</ReviewName>
                    <ReviewScore>⭐ {r.score} / 10</ReviewScore>
                  </ReviewMeta>
                  {r.comment && <ReviewComment>{r.comment}</ReviewComment>}
                </ReviewCard>
              ))}
            </ReviewList>
          )}
        </RatingSection>
      </Content>
    </Page>
  );
}

export default MovieDetailPage;
