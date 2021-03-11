import wings from "../wings.json"

function getWings(id: number) {
    return wings.find(w => w.id == id);
}

export { getWings };