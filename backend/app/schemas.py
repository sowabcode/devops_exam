from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class TypeUtilisateur(str, Enum):
    etudiant   = "etudiant"
    enseignant = "enseignant"
    personnel  = "personnel"


# LIVRES
class LivreBase(BaseModel):
    isbn:      str = Field(..., example="978-2-07-036024-5")
    titre:     str = Field(..., example="Le Petit Prince")
    auteur:    str = Field(..., example="Antoine de Saint-Exupéry")
    categorie: str = Field(..., example="Roman")
    annee:     int = Field(..., example=1943)
    quantite:  int = Field(..., example=5)

class LivreCreate(LivreBase):
    pass

class Livre(LivreBase):
    id:     int
    statut: str
    class Config:
        orm_mode = True


# UTILISATEURS
class UtilisateurBase(BaseModel):
    nom:    str               = Field(..., example="DIOP")
    prenom: Optional[str]     = Field(None, example="Fatou")
    email:  str               = Field(..., example="fatou@dit.sn")
    type:   TypeUtilisateur   = Field(..., example="etudiant")

class UtilisateurCreate(UtilisateurBase):
    pass

class Utilisateur(UtilisateurBase):
    id: int
    class Config:
        orm_mode = True


# EMPRUNTS
class EmpruntBase(BaseModel):
    utilisateur_id: int  = Field(..., example=1)
    livre_id:       int  = Field(..., example=1)
    date_emprunt:   date = Field(..., example="2026-03-09")

class EmpruntCreate(EmpruntBase):
    pass

class EmpruntRetour(BaseModel):
    date_retour: date = Field(..., example="2026-03-22")

class Emprunt(EmpruntBase):
    id:          int
    date_retour: Optional[date]
    statut:      str
    class Config:
        orm_mode = True
