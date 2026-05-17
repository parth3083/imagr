import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

export interface PasswordResetEmailProps {
  resetLink: string;
}

export default function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your Imagr password</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Section style={cardBody}>
              <Text style={brandName}>Imagr</Text>
              <Text style={brandTagline}>AI Prompt Studio</Text>

              <Heading style={heading}>Reset your password</Heading>
              <Text style={paragraph}>
                We received a request to reset the password for your Imagr account. Click the button
                below to choose a new password.
              </Text>

              <Button href={resetLink} style={button}>
                Reset Password
              </Button>

              <Text style={expiry}>
                This link expires in <strong style={expiryHighlight}>1 hour</strong>. If you did not
                request a password reset, you can safely ignore this email.
              </Text>
            </Section>

            <Hr style={divider} />

            <Section style={footer}>
              <Text style={footerText}>
                If the button above doesn&apos;t work, copy and paste this URL into your browser:
                <br />
                <Link href={resetLink} style={footerLink}>
                  {resetLink}
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles

const body: React.CSSProperties = {
  margin: '0',
  padding: '40px 0',
  backgroundColor: '#0a0a0a',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
};

const card: React.CSSProperties = {
  backgroundColor: '#111111',
  border: '1px solid #222222',
  borderRadius: '12px',
  overflow: 'hidden',
};

const cardBody: React.CSSProperties = {
  padding: '40px 48px 32px',
};

const brandName: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '24px',
  fontWeight: '700',
  color: '#ffffff',
  letterSpacing: '-0.5px',
};

const brandTagline: React.CSSProperties = {
  margin: '0 0 32px',
  fontSize: '13px',
  color: '#666666',
};

const heading: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '22px',
  fontWeight: '600',
  color: '#ffffff',
  lineHeight: '1.3',
};

const paragraph: React.CSSProperties = {
  margin: '0 0 28px',
  fontSize: '15px',
  color: '#999999',
  lineHeight: '1.6',
};

const button: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 28px',
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  borderRadius: '8px',
  letterSpacing: '0.1px',
};

const expiry: React.CSSProperties = {
  margin: '28px 0 0',
  fontSize: '13px',
  color: '#555555',
  lineHeight: '1.6',
};

const expiryHighlight: React.CSSProperties = {
  color: '#888888',
};

const divider: React.CSSProperties = {
  borderTop: '1px solid #1e1e1e',
  margin: '0',
};

const footer: React.CSSProperties = {
  padding: '20px 48px',
};

const footerText: React.CSSProperties = {
  margin: '0',
  fontSize: '12px',
  color: '#444444',
};

const footerLink: React.CSSProperties = {
  color: '#666666',
  wordBreak: 'break-all',
};
