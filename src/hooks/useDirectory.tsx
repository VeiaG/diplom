import { Directory } from "@/types/db";
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
export const useDirectory = () => {
    const { data, error, isLoading } = useSWR('/api/directory', fetcher);
    
    return {
        directory: data?.directory as Directory[],
        error,
        isLoading
    }
}