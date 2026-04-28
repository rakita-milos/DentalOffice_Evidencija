import { useCallback, useEffect, useState } from 'react';
export function useApiData(loader, initialValue){
  const [data,setData]=useState(initialValue); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const refresh=useCallback(async()=>{try{setLoading(true);setError('');setData(await loader());}catch(e){setError(e.message);}finally{setLoading(false);}},[loader]);
  useEffect(()=>{refresh();},[refresh]);
  return {data,setData,loading,error,refresh};
}
