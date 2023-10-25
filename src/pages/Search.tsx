import { Box, styled } from "@mui/material";

import Notes from "@/components/search/Notes";
import { SearchForm } from "@/components/search/SearchForm";

const StyledBox = styled(Box)(({ theme }) => ({
	margin: "auto",
	marginTop: "1rem",
	paddingInline: "0.5rem",
}));

function Search() {
	return (
		<StyledBox>
			<SearchForm />
			<Box paddingY="1rem">
				<Notes />
			</Box>
		</StyledBox>
	);
}

export default Search;
