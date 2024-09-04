import { Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = () => {
  const theme = useTheme();

  return (
    <Typography fontWeight="700" fontSize="1.7rem">
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        Long<span style={{ color: theme.palette.primary.main }}>PhimVN</span>
      </Link>
    </Typography>
  );
};

export default Logo;
