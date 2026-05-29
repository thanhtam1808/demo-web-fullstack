import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 6vw;
  background: rgba(255, 247, 251, 0.82);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(14px);
`;

const Brand = styled.h2`
  margin: 0;
  font-family: "Playfair Display", serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.primaryStrong};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const NavLink = styled(Link)`
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgAlt};
  }
`;

const AuthButton = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
    color: #fff;
    box-shadow: 0 8px 20px rgba(255,111,177,0.25);
  `
      : `
    background: ${theme.colors.cardSoft};
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.text};
  `}
  &:hover { transform: translateY(-1px); }
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primaryStrong};
`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Nav>
      <Brand>Moonlight Tickets</Brand>

      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/search">Search</NavLink>

        {user ? (
          <>
            <NavLink to="/tickets">My Tickets</NavLink>
            {user.role === "admin" && (
              <NavLink to="/admin" style={{ color: "#d63384" }}>Admin</NavLink>
            )}
            <UserBadge>👤 {user.name || user.email}</UserBadge>
            <AuthButton $variant="outline" onClick={handleLogout}>
              Logout
            </AuthButton>
          </>
        ) : (
          <>
            <AuthButton $variant="outline" onClick={() => navigate("/login")}>
              Login
            </AuthButton>
            <AuthButton $variant="primary" onClick={() => navigate("/register")}>
              Register
            </AuthButton>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}

export default Navbar;
