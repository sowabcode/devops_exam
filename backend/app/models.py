from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum


class TypeUtilisateur(str, enum.Enum):
    etudiant = "etudiant"
    enseignant = "enseignant"
    personnel = "personnel"


class Livre(Base):
    __tablename__ = "livres"

    id       = Column(Integer, primary_key=True, index=True)
    isbn     = Column(String, unique=True, index=True, nullable=False)
    titre    = Column(String, nullable=False)
    auteur   = Column(String, nullable=False)
    categorie = Column(String)
    annee    = Column(Integer)
    quantite = Column(Integer, default=1)
    statut   = Column(String, default="Disponible")

    emprunts = relationship("Emprunt", back_populates="livre")


class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id      = Column(Integer, primary_key=True, index=True)
    nom     = Column(String, nullable=False)
    prenom  = Column(String)
    email   = Column(String, unique=True, nullable=False)
    type    = Column(Enum(TypeUtilisateur), nullable=False)

    emprunts = relationship("Emprunt", back_populates="utilisateur")


class Emprunt(Base):
    __tablename__ = "emprunts"

    id             = Column(Integer, primary_key=True, index=True)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    livre_id       = Column(Integer, ForeignKey("livres.id"), nullable=False)
    date_emprunt   = Column(Date, nullable=False)
    date_retour    = Column(Date, nullable=True)  # None = pas encore rendu
    statut         = Column(String, default="En cours")  # En cours | Rendu | En retard

    utilisateur = relationship("Utilisateur", back_populates="emprunts")
    livre       = relationship("Livre", back_populates="emprunts")
