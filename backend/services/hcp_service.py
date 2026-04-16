from models.hcp import HCP


def get_or_create_hcp(db, name: str):

    hcp = db.query(HCP).filter(HCP.name == name).first()

    if hcp:
        return hcp


    new_hcp = HCP(name=name)
    db.add(new_hcp)
    db.commit()
    db.refresh(new_hcp)

    return new_hcp