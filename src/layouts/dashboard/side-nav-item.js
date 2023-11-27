import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase, Typography } from '@mui/material';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, beta } = props;

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Display Beta label below the title
          }}
        >
          <Typography
            component="span"
            sx={{
              color: 'neutral.400',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              ...(active && {
                color: 'common.white'
              }),
              ...(disabled && {
                color: 'neutral.500'
              })
            }}
          >
            {title}
          </Typography>
          {beta && (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                marginLeft: '80px',
                fontFamily: 'sans-serif',
                marginTop: '-8px',
                color: '#87CEEB',
                opacity: 0.5,
              }}
            >
              Beta
            </Typography>
          )}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  beta: PropTypes.bool, // Add beta prop type
};
