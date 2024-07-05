import { useCallback, useState } from "react";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback((async (requestConfig, applyData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(
                requestConfig.url,
                {
                    method: requestConfig.method ? requestConfig.method : 'GET',
                    body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                    headrs: requestConfig.headers ? requestConfig.headers : {} 
                }
            )

            if(!response.ok) {
                throw new Error('Request failed!')
            }

            const responseData = await response.json();

            const loadedMeals = [];

            for (const key in responseData) {
                loadedMeals.push({
                    id: key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price
                })
            }

            applyData(loadedMeals);
        } catch(err) {
            setIsLoading(false);
            setError(err.message || 'Something went wrong!');
        }

        setIsLoading(false);
    }), []);

    return {
        isLoading: isLoading,
        error: error,
        sendRequest: sendRequest
    }
};

export default useHttp;
