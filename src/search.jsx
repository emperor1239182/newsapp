import { FaSearch } from "react-icons/fa"; 
import { SearchContext } from "./searchContext";
import { useContext } from "react";

export const SearchInput = ({onSearch}) => {
    const { inputValue, setInputValue } = useContext(SearchContext);

  return (
    <div style={{ position: "relative" }} id="search">
      <FaSearch
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#aaa",
        }}
        onClick={onSearch}
      />
      <input
        type="text"
        placeholder="Search..."
        style={{
          width: "150px",
          height: "35px",
          paddingRight: "35px", // Make space for the icon
          border: "1px solid #ccc",
          borderRadius: "16px",
        }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

