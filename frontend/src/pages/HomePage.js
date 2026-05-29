import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";

const Page = styled.div`
  padding: 30px 6vw 90px;
`;

const HeroWrap = styled.section`
  margin-top: 10px;
`;

const Hero = styled.div`
  min-height: 420px;
  border-radius: 34px;
  background-size: cover;
  background-position: center;
  display: grid;
  align-items: center;
  padding: clamp(24px, 4vw, 54px);
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const HeroScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 240, 246, 0.95),
    rgba(255, 240, 246, 0.3)
  );
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 520px;
`;

const Eyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.32em;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.7rem;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  margin: 0 0 15px;
`;

const HeroDesc = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 24px;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ButtonLink = styled(Link)`
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
    color: #fff;
    box-shadow: 0 12px 30px rgba(255, 111, 177, 0.3);
  `
      : `
    background: ${theme.colors.cardSoft};
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.text};
  `}

  &:hover {
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  margin-top: 70px;
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.6rem, 2vw + 1rem, 2.6rem);
`;

const SubtleLink = styled(Link)`
  padding: 10px 16px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const StepCard = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 22px;
  background: ${({ theme }) => theme.colors.cardSoft};

  h4 {
    margin: 12px 0 8px;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const StepIndex = styled.span`
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.primaryStrong};
`;

function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    movieApi
      .getAll({ status: "showing" })
      .then((data) => setMovies(data))
      .catch((err) => console.error("Lỗi tải phim:", err));
  }, []);

  const featured = useMemo(() => movies?.[0], [movies]);
  const heroImage = featured?.banner || featured?.poster;

  return (
    <Page>
      {featured && (
        <HeroWrap>
          <Hero style={{ backgroundImage: `url(${heroImage})` }}>
            <HeroScrim />
            <HeroContent>
              <Eyebrow>Now showing</Eyebrow>
              <HeroTitle>{featured.title}</HeroTitle>
              <HeroDesc>{featured.description}</HeroDesc>
              <HeroActions>
                <ButtonLink $variant="primary" to={`/booking/${featured._id}`}>
                  Book ticket
                </ButtonLink>
                <ButtonLink to={`/movie/${featured._id}`}>
                  View detail
                </ButtonLink>
              </HeroActions>
            </HeroContent>
          </Hero>
        </HeroWrap>
      )}

      <Section>
        <SectionHead>
          <div>
            <Eyebrow>Fresh picks</Eyebrow>
            <SectionTitle>Now showing</SectionTitle>
          </div>
          <SubtleLink to="/search">Browse all</SubtleLink>
        </SectionHead>

        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </MovieGrid>
      </Section>

      <Section>
        <SectionTitle>Book in 3 quick steps</SectionTitle>
        <StepsGrid>
          <StepCard>
            <StepIndex>01</StepIndex>
            <h4>Pick a movie</h4>
            <p>Browse trailers and choose your perfect show.</p>
          </StepCard>
          <StepCard>
            <StepIndex>02</StepIndex>
            <h4>Choose seats</h4>
            <p>See the real seat map and lock your spots.</p>
          </StepCard>
          <StepCard>
            <StepIndex>03</StepIndex>
            <h4>Enjoy the show</h4>
            <p>Scan your ticket and skip the queue.</p>
          </StepCard>
        </StepsGrid>
      </Section>
    </Page>
  );
}

export default HomePage;
