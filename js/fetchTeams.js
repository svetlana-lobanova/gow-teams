import {collection, getDocs, query, where} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {db} from './firebase.js';

export async function fetchTeams(types) {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("type", "array-contains", types[0]));

    try {
        const querySnapshot = await getDocs(q);
        const teamsWithAllTypes = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && types.every(type => data.type.includes(type))) {
                teamsWithAllTypes.push(data.code);
            }
        });
        return [...new Set(teamsWithAllTypes)];
    } catch (error) {
        console.error("Ошибка получения данных: ", error);
        return [];
    }
}