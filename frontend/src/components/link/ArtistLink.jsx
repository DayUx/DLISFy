import { useEffect, useState } from "react";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Link } = Typography;
const ArtistLink = ({ id }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  useEffect(() => {
    get(API.getArtisteById + "/" + id, {
      success: (data) => {
        setName(data.name);
      },
    });
  }, [id]);
  return (
    <Link
      onClick={() => {
        navigate("/artist/" + id);
      }}
    >
      {name}
    </Link>
  );
};

export default ArtistLink;
