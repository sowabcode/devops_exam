from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas, crud
from .database import engine, SessionLocal, Base

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DIT Bibliothèque API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  LIVRES

@app.post("/api/livres/", response_model=schemas.Livre)
def creer_livre(livre: schemas.LivreCreate, db: Session = Depends(get_db)):
    if crud.get_livre_by_isbn(db, livre.isbn):
        raise HTTPException(400, detail=f"ISBN '{livre.isbn}' déjà existant")
    return crud.create_livre(db, livre)

@app.get("/api/livres/", response_model=List[schemas.Livre])
def lister_livres(db: Session = Depends(get_db)):
    return crud.get_livres(db)

@app.get("/api/livres/search", response_model=List[schemas.Livre])
def rechercher_livres(q: str, db: Session = Depends(get_db)):
    return crud.search_livres(db, q)

@app.get("/api/livres/{livre_id}", response_model=schemas.Livre)
def get_livre(livre_id: int, db: Session = Depends(get_db)):
    livre = crud.get_livre(db, livre_id)
    if not livre:
        raise HTTPException(404, detail="Livre introuvable")
    return livre

@app.put("/api/livres/{livre_id}", response_model=schemas.Livre)
def modifier_livre(livre_id: int, data: schemas.LivreCreate, db: Session = Depends(get_db)):
    livre = crud.update_livre(db, livre_id, data)
    if not livre:
        raise HTTPException(404, detail="Livre introuvable")
    return livre

@app.delete("/api/livres/{livre_id}")
def supprimer_livre(livre_id: int, db: Session = Depends(get_db)):
    crud.delete_livre(db, livre_id)
    return {"message": "Livre supprimé avec succès"}


#  UTILISATEURS

@app.post("/api/utilisateurs/", response_model=schemas.Utilisateur)
def creer_utilisateur(user: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    return crud.create_utilisateur(db, user)

@app.get("/api/utilisateurs/", response_model=List[schemas.Utilisateur])
def lister_utilisateurs(db: Session = Depends(get_db)):
    return crud.get_utilisateurs(db)

@app.get("/api/utilisateurs/{user_id}", response_model=schemas.Utilisateur)
def get_utilisateur(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_utilisateur(db, user_id)
    if not user:
        raise HTTPException(404, detail="Utilisateur introuvable")
    return user

@app.delete("/api/utilisateurs/{user_id}")
def supprimer_utilisateur(user_id: int, db: Session = Depends(get_db)):
    crud.delete_utilisateur(db, user_id)
    return {"message": "Utilisateur supprimé avec succès"}


#  EMPRUNTS

@app.post("/api/emprunts/", response_model=schemas.Emprunt)
def creer_emprunt(emprunt: schemas.EmpruntCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_emprunt(db, emprunt)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

@app.get("/api/emprunts/", response_model=List[schemas.Emprunt])
def lister_emprunts(db: Session = Depends(get_db)):
    return crud.get_emprunts(db)

@app.put("/api/emprunts/{emprunt_id}/retour", response_model=schemas.Emprunt)
def retourner_livre(emprunt_id: int, data: schemas.EmpruntRetour, db: Session = Depends(get_db)):
    try:
        return crud.retourner_livre(db, emprunt_id, data)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

@app.get("/api/utilisateurs/{user_id}/emprunts", response_model=List[schemas.Emprunt])
def historique_utilisateur(user_id: int, db: Session = Depends(get_db)):
    return crud.get_historique_utilisateur(db, user_id)

@app.get("/api/emprunts/retards/", response_model=List[schemas.Emprunt])
def retards(db: Session = Depends(get_db)):
    return crud.detect_retards(db)
