import { useEffect } from 'react';

/** @TODO: reflection promise status */
// todo get rid of async reflection
const useAsyncEffect = (
	reflected: (...p: any) => Promise<any>,
	dependencies: any[]
) => {
	useEffect(() => void reflected(), dependencies);
};

export default useAsyncEffect;
