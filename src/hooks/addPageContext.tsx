//context for managing state on ADD page
// curentyle state is any , will change later

import { useContext } from "react";
import { createContext, useState } from "react";

type AddPageContextType = {
    data:{
        [key:string]:string | number
    };
    setKey: (key:string,value:string|number) => void;
    isNull: (key:string) => boolean;
    setAll: (data:{
        [key:string]:string | number
    }) => void;
}

export const AddPageContext = createContext<AddPageContextType>({
    data:{},
    setKey: () => {},
    isNull: () => false,
    setAll: () => {}
});


const AddPageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [data,setData] = useState<{
        [key:string]:string | number
    }>({});

    const setKey = (key:string,value:string|number) => {
        setData({
            ...data,
            [key]:value
        })
    }

    const isNull = (key:string) => {
        return data[key] === undefined || data[key] === null || data[key] === '';
    }

    return (
        <AddPageContext.Provider value={{data,setKey,isNull,setAll:setData}}>
            {children}
        </AddPageContext.Provider>
    )
}
const useAddPage = () => {
    return useContext(AddPageContext);
}

export {AddPageProvider,useAddPage}
