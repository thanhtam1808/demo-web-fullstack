import { useState, useEffect } from "react";
import styled from "styled-components";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";

const Page = styled.div`
  padding: 30px 6vw 90px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;
const Title = styled.h2`
  margin: 0;
  font-family: "Playfair Display", serif;
  font-size: clamp(1.8rem, 2vw + 1rem, 2.6rem);
`;
const SearchBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: ${({ theme }) => theme.colors.cardSoft};
  padding: 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;
const Count = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px;
`;
const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;
const FilterBtn = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  ${({ $active, theme }) =>
    $active
      ? `background: linear-gradient(135deg,${theme.colors.primary},${theme.colors.accent}); color:#fff; border-color:transparent;`
      : `background:${theme.colors.cardSoft}; color:${theme.colors.muted};`}
`;

const STATUS_LABELS = {
  "": "All",
  showing: "Now Showing",
  upcoming: "Coming Soon",
  ended: "Past",
};

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    movieApi.getAll().then(setMovies).catch(console.error);
  }, []);

  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (status === "" || m.status === status),
  );

  return (
    <Page>
      <Header>
        <Title>Find your dreamy movie night</Title>
        <SearchBox>
          <Input
            placeholder="Search movie title..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Count>{filtered.length} results</Count>
        </SearchBox>
      </Header>

      <FilterRow>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <FilterBtn
            key={key}
            $active={status === key}
            onClick={() => setStatus(key)}
          >
            {label}
          </FilterBtn>
        ))}
      </FilterRow>

      <Grid>
        {filtered.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </Grid>
    </Page>
  );
}

export default SearchPage;
