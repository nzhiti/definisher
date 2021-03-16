const parser = require('fast-xml-parser');
const fs = require('fs');
const Distance = require('geo-distance');
const db = require('#db');

function getDistance(a, b) {
    const d = Distance.between(a, b);
    const { distance, unit } = d.human_readable_in_units('km', 'm');

    if (unit === 'm') {
        return distance / 1000;
    }

    return distance;
}

function truncateTrk(originalTrk, currentDistance, targetDistance, lastPoint = null) {
    const trk = Object.assign({}, originalTrk);
    const points = trk.trkseg.trkpt;
    const remainingPoints = [];

    if (lastPoint === null && points.length > 0) {
        remainingPoints.push(points[0]);
    }

    let reachedEnd = false;
    for (let i = 1; i < points.length; i += 1) {
        const d = parseFloat(getDistance(
            { lat: points[i - 1]['@_lat'], lon: points[i - 1]['@_lon'] },
            { lat: points[i]['@_lat'], lon: points[i]['@_lon'] },
        ));

        if (currentDistance + d > targetDistance) {
            reachedEnd = true;
            break;
        }

        currentDistance += d;
        remainingPoints.push(points[i]);
    }

    trk.trkseg.trkpt = remainingPoints;

    return {
        trk,
        reachedEnd,
        currentDistance,
        lastPoint: remainingPoints.length > 0 ? remainingPoints.slice(-1)[0] : lastPoint,
    };
}

function truncateGpx(originalGpx, targetDistance) {
    const gpx = Object.assign({}, originalGpx);
    let trks = gpx.trk;
    let multipleTrks = Object.prototype.toString.apply(trks) === '[object Array]';
    if (!multipleTrks) {
        trks = [gpx.trk];
    }

    let lastPoint = null;
    let currentDistance = 0;
    let newTrks = [];

    for (let i = 0; i < trks.length; i += 1) {
        const response = truncateTrk(
            trks[i],
            currentDistance,
            targetDistance,
            lastPoint,
        );
        currentDistance = response.currentDistance;
        lastPoint = response.lastPoint;

        newTrks.push(response.trk);

        if (response.reachedEnd === true) {
            break;
        }
    }

    if (!multipleTrks) {
        gpx.trk = newTrks[0];
    } else {
        gpx.trk = newTrks;
    }

    return gpx;
}

module.exports = async (req, res) => {
    /* @todo: ça devrait être challenge inscrits non ? */
    const challenge = req.utilisateur.challenges.find(({ challenge_id }) => {
        return challenge_id === parseInt(req.params.challenge_id, 10);
    });

    if (challenge === undefined) {
        return res.status(404).send({
            user_message: 'Vous n\êtes pas inscrit à ce défi',
        });
    }

    const json = parser.parse(fs.readFileSync(`./assets/gpx/${challenge.slug}.gpx`).toString(), {
        attributeNamePrefix: '@_',
        ignoreAttributes: false,
    });

    /****************
     * @TODO: ne plus saisir [0]
     ****************/
    const maxDistance = Math.min(
        challenge.etapes[0].distance,
        challenge.etapes[0].distance - challenge.etapes[0].distance_restante,
    );
    json.gpx = truncateGpx(json.gpx, maxDistance);

    const jsonParser = new parser.j2xParser({
        attributeNamePrefix: "@_",
        ignoreAttributes: false,
    });

    return res
        .status(200)
        .set('Content-Type', 'text/xml')
        .send(jsonParser.parse(json).toString());
};