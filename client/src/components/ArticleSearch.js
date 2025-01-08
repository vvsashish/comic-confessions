import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import useDebounce from "../hooks/useDebounce";

const ArticleSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQuery = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedQuery || debouncedQuery === "") {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm === "") {
      onSearch(newSearchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(searchTerm);
    }
  };

  return (
    <Form inline className="my-4">
      <FormControl
        type="text"
        placeholder="Search articles"
        className="mr-sm-2"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </Form>
  );
};

export default ArticleSearch;
