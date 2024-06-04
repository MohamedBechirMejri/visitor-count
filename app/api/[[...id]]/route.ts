
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { hexToCSSFilter } from 'hex-to-css-filter';
import fillGaps from '../../../libs/fillGaps';
import getImg from '../../../libs/getImg';
import { Numbers } from '../../../libs/numbers';
import { NextRequest } from 'next/server';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'visitor-count-66755.firebaseapp.com',
    projectId: 'visitor-count-66755',
    storageBucket: 'visitor-count-66755.appspot.com',
    messagingSenderId: '618673330830',
    appId: '1:618673330830:web:73f8178c7fa23cb87407df',
    databaseURL:
        'https://visitor-count-66755-default-rtdb.europe-west1.firebasedatabase.app',
};

export async function GET(req: NextRequest, { params }: { params: { id: string[]; } }) {
    let { id: ID } = params;
    const id = ID.join(',');

    const url = new URL(req.url);
    const hexColor = url.searchParams.get('hexColor');

    const isLoser = ID && ID[0] === 'AminDhouib';

    const ip = req.ip || req.headers.get('X-Forwarded-For') || '0.0.0.0'

    console.log('ip', ip);

    if (isLoser) {
        return new Response(
            `<svg height="40" width="200" xmlns="http://www.w3.org/2000/svg">
                <text x="5" y="30" fill="none" stroke="red" font-size="35">I'm Gay 🥖</text>
            </svg>`,
            {
                status: 200,
                headers: { "Content-Type": 'image/svg+xml; charset=utf-8' },
            }
        );
    }

    const filter = hexColor
        ? hexToCSSFilter(`#${hexColor}`).filter
        : 'invert(68%) sepia(17%) saturate(1307%) hue-rotate(106deg) brightness(94%) contrast(91%)';

    try {
        await initializeApp(firebaseConfig);

        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `users/`));

        if (snapshot.exists()) {
            const result = snapshot.val();
            let user = result[id] || 0;

            // check if user is of type object
            if (typeof user === 'number') {
                user = { views: user, uniqueViews: [] };
            }

            const views = (user.views || 0) + 1;
            const uniqueViews = (user.uniqueViews || []).includes(ip) ? user.uniqueViews || [] : [...user.uniqueViews, ip];

            const db = getDatabase();
            await set(ref(db, 'users/' + id), { views, uniqueViews });

            return new Response(
                `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="260"
                    height="69"
                    version="1.1"
                    style='filter: ${filter}; font-family: monospace, sans-serif; font-size: 10px;'>
                    <title>Visitor Count</title>
                    <g style='transform: translate(0, -26px); scale: 1;'>
                        ${fillGaps(uniqueViews.length)
                    .map((d, i) => getImg(i * 35, Numbers[d]))
                    .join('')}
                    </g>
                    <text x="0" y="60" fill="none" stroke="black" font-size="14" style='transform: translate(24%, 8%);'>
                        total views: ${views}
                    </text>
                </svg>`,
                {
                    status: 200,
                    headers: { "Content-Type": 'image/svg+xml; charset=utf-8' },
                }
            );
        } else {
            return new Response('No data found', { status: 404 });
        }
    } catch (error: any) {
        console.error(error);
        return new Response('Error: ' + error.message, { status: 500 });
    }
}

// no cache
export const dynamic = 'force-dynamic';