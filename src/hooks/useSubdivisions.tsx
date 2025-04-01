import { Subdivision } from "@/types/db";
import useSWR from "swr";

// @ts-expect-error : can't specify types for fetcher
const fetcher = (...args) => fetch(...args).then(res => {
    if (!res.ok) {
        return res.json().then(data => {
            // Якщо є помилка в відповіді API, кидаємо її
            throw new Error(data.error || 'Unknown error');
        });
    }
    return res.json();
});
export const useSubdivisions = () => {
    const { data, error, isLoading } = useSWR('/api/subdivisions', fetcher);
    
    return {
        subdivisions: data?.subdivisions as Subdivision[],
        error,
        isLoading
    }
}