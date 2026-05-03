import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',   // ← was 127.0.0.1, now localhost
});

api.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem('userInfo');
        const userInfo = stored ? JSON.parse(stored) : null;
        if (userInfo?.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
    } catch {}
    return config;
});

export default api;

export async function getRecommendations(profile, imageFile) {
    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));

    if (imageFile) {
        formData.append('selfie', imageFile);
    } else {
        const pixel = new Uint8Array([
            137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,
            0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,
            0,0,0,12,73,68,65,84,8,215,99,248,15,0,0,1,1,0,5,24,
            213,78,0,0,0,0,73,69,78,68,174,66,96,130
        ]);
        formData.append('selfie', new Blob([pixel], { type: 'image/png' }), 'placeholder.png');
    }

    const response = await fetch('http://127.0.0.1:8000/recommend', {
        method: 'POST', body: formData,
    });
    if (!response.ok) throw new Error('Recommendation failed');
    return response.json();
}