import { Affix, Flex, Input } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ query, onQueryBooks }) {
  const navigate = useNavigate();

  return (
    <Affix offsetTop={10}>
      <Flex>
        <Input
          size="large"
          onChange={(e) => {
            onQueryBooks(e.target.value);
          }}
          value={query}
          placeholder="Search books, bookmarks or text"
          prefix={<SearchOutlined />}
          suffix={
            <MenuOutlined
              onClick={() => {
                navigate("/settings");
              }}
            />
          }
        />
      </Flex>
    </Affix>
  );
}
