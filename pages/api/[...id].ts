import type { NextApiRequest, NextApiResponse } from 'next'

import { initializeApp } from 'firebase/app'
import { child, get, getDatabase, ref, set } from 'firebase/database'
import { hexToCSSFilter } from 'hex-to-css-filter'

import getImg from '../../libs/getImg'
import fillGaps from '../../libs/fillGaps'
import { Numbers } from '../../libs/numbers'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'visitor-count-66755.firebaseapp.com',
    projectId: 'visitor-count-66755',
    storageBucket: 'visitor-count-66755.appspot.com',
    messagingSenderId: '618673330830',
    appId: '1:618673330830:web:73f8178c7fa23cb87407df',
    databaseURL:
        'https://visitor-count-66755-default-rtdb.europe-west1.firebasedatabase.app',
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { id, hexColor } = req.query

    const isLoser = id && id[0] === 'AminDhouib'
    
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')

    if (isLoser) return res.send(`<svg height="40" width="200" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="30" fill="none" stroke="red" font-size="35">I'm Gay 🥖</text>
  </svg>`)

    const filter = hexColor
        ? hexToCSSFilter(`#${hexColor}`).filter
        : 'invert(68%) sepia(17%) saturate(1307%) hue-rotate(106deg) brightness(94%) contrast(91%)'

    await initializeApp(firebaseConfig)

    const dbRef = await ref(getDatabase())

    get(child(dbRef, `users/`))
        .then(async snapshot => {
            if (snapshot.exists()) {
                const visits = (snapshot.val()[`${id}`] || 0) + 1

                const db = await getDatabase()
                await set(ref(db, 'users/' + id), visits)

                res.send(
                    `<svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="260"
                        height="50"
                        version="1.1"
                        style='filter: ${filter};'>

                        <title>Visitor Count</title>
                        <g style='transform: translateY(-25px)'>
                            ${fillGaps(visits)
                                .map((d: number, i: number) =>
                                    getImg(i * 35, Numbers[d]),
                                )
                                .join('')}
                        </g>
                    </svg>`,
                )
            }
        })
        .catch(error => {
            console.error(error)
        })
}
