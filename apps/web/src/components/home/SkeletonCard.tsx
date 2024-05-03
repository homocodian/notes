import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Skeleton,
} from "@mui/material";

function SkeletonCard() {
	return (
		<Card sx={{ minWidth: 300 }}>
			<CardHeader
				title={
					<Skeleton
						animation="wave"
						width={100}
						height={30}
						variant="circular"
						sx={{
							borderRadius: 999,
						}}
					/>
				}
				sx={{ fontWeight: 500 }}
			/>
			<CardContent>
				<Skeleton animation="wave" width="80%" height={20} variant="text" />
				<Skeleton animation="wave" width="70%" height={20} variant="text" />
				<Skeleton animation="wave" width="65%" height={20} variant="text" />
			</CardContent>
			<CardActions>
				<Skeleton animation="wave" width="40%" height={25} />
			</CardActions>
		</Card>
	);
}
export default SkeletonCard;
