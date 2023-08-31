import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import SkeletonCard from "@/components/home/SkeletonCard";

type NoteSkeletonProps = {
	count?: number;
};

function NoteSkeleton({ count = 9 }: NoteSkeletonProps) {
	if (typeof count !== "number") {
		throw new Error("Count should be number");
	}

	return (
		<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
			<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
				{[...Array(count).keys()].map((number) => (
					<SkeletonCard key={number} />
				))}
			</Masonry>
		</Box>
	);
}

export default NoteSkeleton;
