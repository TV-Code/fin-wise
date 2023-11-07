import React, { createContext, useState, useContext } from 'react';

const SearchFilterContext = createContext();

export const useSearchFilter = () => {
    return useContext(SearchFilterContext);
};

export const SearchFilterProvider = ({ children }) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Date \u2198\uFE0E");

    return (
        <SearchFilterContext.Provider value={{ search, setSearch, filter, setFilter }}>
            {children}
        </SearchFilterContext.Provider>
    );
};
