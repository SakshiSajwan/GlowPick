const axios = require('axios');
const FormData = require('form-data');

const getRecommendations = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const profile = req.body.profile;
        const image = req.file;

        if (!profile || !image) {
            return res.status(400).json({ message: "Profile and image required" });
        }

        const formData = new FormData();

        formData.append("profile", profile);
        formData.append("selfie", image.buffer, {
            filename: image.originalname,
            contentType: image.mimetype
        });

        const response = await axios.post(
            "http://127.0.0.1:8000/recommend",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                maxBodyLength: Infinity
            }
        );

        console.log("FASTAPI RESPONSE:", response.data);

        res.json(response.data);

    } catch (error) {
        console.error("❌ FULL ERROR:", error.response?.data || error.message);
        res.status(500).json({ message: "Recommendation failed" });
    }
};

module.exports = { getRecommendations };