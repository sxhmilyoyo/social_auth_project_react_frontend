import axios from "axios";

const fbLogin = async (accesstoken) => {
    let res = await axios.post(
        "http://localhost:8000/dj-rest-auth/facebook/",
        {
            access_token: accesstoken,
        }
    );
    return await res.data.key;
};

export default fbLogin;