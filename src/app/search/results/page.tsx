import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function CategoryResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}