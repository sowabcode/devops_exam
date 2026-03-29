from sqlalchemy.orm import Session
from datetime import date
from . import models, schemas

LIMITES = {
    "etudiant":   2,
    "enseignant": 5,
    "personnel":  3,
}

# ─── LIVRES ───────────────────────────────────────────────
def get_livres(db: Session):
    return db.query(models.Livre).all()

def get_livre(db: Session, livre_id: int):
    return db.query(models.Livre).filter(models.Livre.id == livre_id).first()

def get_livre_by_isbn(db: Session, isbn: str):
    return db.query(models.Livre).filter(models.Livre.isbn == isbn).first()

def create_livre(db: Session, livre: schemas.LivreCreate):
    db_livre = models.Livre(**livre.dict())
    db.add(db_livre)
    db.commit()
    db.refresh(db_livre)
    return db_livre

def update_livre(db: Session, livre_id: int, data: schemas.LivreCreate):
    db_livre = get_livre(db, livre_id)
    if db_livre:
        for key, value in data.dict().items():
            setattr(db_livre, key, value)
        db.commit()
        db.refresh(db_livre)
    return db_livre

def delete_livre(db: Session, livre_id: int):
    db_livre = get_livre(db, livre_id)
    if db_livre:
        db.delete(db_livre)
        db.commit()
    return db_livre

def search_livres(db: Session, q: str):
    like = f"%{q}%"
    return db.query(models.Livre).filter(
        models.Livre.titre.ilike(like) |
        models.Livre.auteur.ilike(like) |
        models.Livre.isbn.ilike(like)
    ).all()


# ─── UTILISATEURS ─────────────────────────────────────────
def get_utilisateurs(db: Session):
    return db.query(models.Utilisateur).all()

def get_utilisateur(db: Session, user_id: int):
    return db.query(models.Utilisateur).filter(models.Utilisateur.id == user_id).first()

def create_utilisateur(db: Session, user: schemas.UtilisateurCreate):
    db_user = models.Utilisateur(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_utilisateur(db: Session, user_id: int):
    db_user = get_utilisateur(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


# ─── EMPRUNTS ─────────────────────────────────────────────
def get_emprunts(db: Session):
    return db.query(models.Emprunt).all()

def get_emprunt(db: Session, emprunt_id: int):
    return db.query(models.Emprunt).filter(models.Emprunt.id == emprunt_id).first()

def create_emprunt(db: Session, emprunt: schemas.EmpruntCreate):
    # Vérifier utilisateur
    user = get_utilisateur(db, emprunt.utilisateur_id)
    if not user:
        raise ValueError("Utilisateur introuvable")

    # Vérifier livre
    livre = get_livre(db, emprunt.livre_id)
    if not livre:
        raise ValueError("Livre introuvable")
    if livre.statut != "Disponible":
        raise ValueError("Livre non disponible")

    # Vérifier limite d'emprunt
    emprunts_actifs = db.query(models.Emprunt).filter(
        models.Emprunt.utilisateur_id == user.id,
        models.Emprunt.statut == "En cours"
    ).count()
    limite = LIMITES.get(user.type.value, 2)
    if emprunts_actifs >= limite:
        raise ValueError(f"Limite d'emprunt atteinte ({limite} max)")

    # Créer l'emprunt
    db_emprunt = models.Emprunt(**emprunt.dict(), statut="En cours")
    db.add(db_emprunt)

    # Mettre à jour le statut du livre
    livre.statut = "Emprunté"
    db.commit()
    db.refresh(db_emprunt)
    return db_emprunt

def retourner_livre(db: Session, emprunt_id: int, data: schemas.EmpruntRetour):
    db_emprunt = get_emprunt(db, emprunt_id)
    if not db_emprunt:
        raise ValueError("Emprunt introuvable")

    db_emprunt.date_retour = data.date_retour
    db_emprunt.statut = "Rendu"

    # Remettre le livre disponible
    db_emprunt.livre.statut = "Disponible"
    db.commit()
    db.refresh(db_emprunt)
    return db_emprunt

def get_historique_utilisateur(db: Session, user_id: int):
    return db.query(models.Emprunt).filter(
        models.Emprunt.utilisateur_id == user_id
    ).all()

def detect_retards(db: Session):
    today = date.today()
    emprunts = db.query(models.Emprunt).filter(
        models.Emprunt.statut == "En cours"
    ).all()
    retards = []
    for e in emprunts:
        jours = (today - e.date_emprunt).days
        if jours > 14:  # retard après 14 jours
            e.statut = "En retard"
            retards.append(e)
    db.commit()
    return retards
