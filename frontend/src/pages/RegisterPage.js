import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authApi } from "../api/movieApi";

const Page   = styled.div`min-height: 80vh; display: grid; place-items: center; padding: 40px 20px;`;
const Card   = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 32px; padding: 40px 36px;
  width: 100%; max-width: 420px; box-shadow: ${({ theme }) => theme.shadow};
`;
const Brand  = styled.p`font-family:"Playfair Display",serif; font-weight:700; color:${({ theme }) => theme.colors.primaryStrong}; font-size:1rem; margin:0 0 24px; letter-spacing:0.05em;`;
const Title  = styled.h2`font-family:"Playfair Display",serif; font-size:2rem; margin:0 0 6px;`;
const Sub    = styled.p`color:${({ theme }) => theme.colors.muted}; margin:0 0 28px; font-size:0.95rem;`;
const Form   = styled.form`display:grid; gap:16px;`;
const Label  = styled.label`font-size:0.8rem; font-weight:600; color:${({ theme }) => theme.colors.muted}; text-transform:uppercase; letter-spacing:0.1em;`;
const Input  = styled.input`
  width:100%; padding:12px 16px; border-radius:14px;
  border:1px solid ${({ theme }) => theme.colors.border};
  background:${({ theme }) => theme.colors.cardSoft};
  font-size:0.95rem; font-family:inherit; outline:none;
  &:focus { border-color:${({ theme }) => theme.colors.primary}; }
`;
const Group  = styled.div`display:grid; gap:6px;`;
const Btn    = styled.button`
  width:100%; padding:14px; border-radius:999px; border:none;
  font-weight:700; font-size:1rem; cursor:pointer;
  background:linear-gradient(135deg,${({ theme }) => theme.colors.primary},${({ theme }) => theme.colors.accent});
  color:#fff; box-shadow:0 12px 30px rgba(255,111,177,0.3); transition:transform 0.2s;
  &:hover:not(:disabled) { transform:translateY(-2px); }
  &:disabled { opacity:0.6; cursor:not-allowed; }
`;
const ErrMsg = styled.p`background:rgba(214,51,132,0.08); color:${({ theme }) => theme.colors.primaryStrong}; border-radius:12px; padding:10px 14px; font-size:0.88rem; margin:0;`;
const OkMsg  = styled.p`background:rgba(100,200,100,0.1); color:green; border-radius:12px; padding:10px 14px; font-size:0.88rem; margin:0;`;
const Switch = styled.p`text-align:center; font-size:0.9rem; color:${({ theme }) => theme.colors.muted}; margin:0;`;
const SLink  = styled(Link)`color:${({ theme }) => theme.colors.primaryStrong}; font-weight:600;`;

function RegisterPage() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "", phone: "" });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await authApi.register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Brand>Moonlight Tickets</Brand>
        <Title>Create account</Title>
        <Sub>Join to start booking movies</Sub>

        <Form onSubmit={handleSubmit}>
          <Group>
            <Label>Full name</Label>
            <Input placeholder="Nguyễn Văn A" value={form.name} onChange={set("name")} required />
          </Group>
          <Group>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
          </Group>
          <Group>
            <Label>Password</Label>
            <Input type="password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} required minLength={6} />
          </Group>
          <Group>
            <Label>Phone (optional)</Label>
            <Input placeholder="0901234567" value={form.phone} onChange={set("phone")} />
          </Group>
          {error   && <ErrMsg>{error}</ErrMsg>}
          {success && <OkMsg>Account created! Redirecting to login... 🎉</OkMsg>}
          <Btn type="submit" disabled={loading || success}>
            {loading ? "Creating..." : "Create account"}
          </Btn>
        </Form>

        <Switch style={{ marginTop: 20 }}>
          Already have an account? <SLink to="/login">Sign in</SLink>
        </Switch>
      </Card>
    </Page>
  );
}

export default RegisterPage;
