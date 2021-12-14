import { styled } from "@mui/system"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"

const BootstrapTooltip = styled(({ className, ...props}: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white
  },
}));

type CustomTooltipProps = {
  title: string,
  children: React.ReactElement<"button">
}

function CustomTooltip({title,children}:CustomTooltipProps) {
  return (
    <BootstrapTooltip title={title}>
      {children}
    </BootstrapTooltip>
  )
}

export default CustomTooltip
