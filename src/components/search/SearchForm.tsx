import { useSearchParams } from "react-router-dom";

import { CircularProgress, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchLoading } from "@/store/search/loading";

export function SearchForm() {
	const [searchParams, setSearchParams] = useSearchParams();
	const loading = useSearchLoading((state) => state.loading);

	const query = searchParams.get("q") ?? "";

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const form = new FormData(e.currentTarget);
				const search = form.get("search")?.toString() ?? "";
				searchParams.set("q", search);
				setSearchParams(searchParams);
			}}
		>
			<Input
				sx={{
					ml: 1,
					width: "100%",
					padding: "4px",
					marginLeft: 0,
				}}
				placeholder="Search"
				inputProps={{ "aria-label": "search" }}
				disabled={loading}
				key={query}
				endAdornment={
					loading ? (
						<CircularProgress aria-describedby="searching" size={20} />
					) : (
						<SearchIcon
							sx={{
								height: 20,
								width: 20,
							}}
						/>
					)
				}
				defaultValue={query}
				name="search"
			/>
		</form>
	);
}
