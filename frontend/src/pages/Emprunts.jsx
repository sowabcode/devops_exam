import clsx from "clsx";
import { useContext, useState } from "react";
import { FaCirclePlus, FaXmark } from "react-icons/fa6";

import LayoutContext from "../contexts/LayoutContext";

import m1 from "../assets/m1.jpeg";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Emprunts = () => {
  const queryClient = useQueryClient();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [livre, setLivre] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [dateemprunt, setDateemprunt] = useState("");
  const [utilisateur, setUtilisateur] = useState("");

  const { showSidebar } = useContext(LayoutContext);

  const { data: emprunts } = useQuery({
    queryKey: ["emprunts"],
    queryFn: () => fetch(`${BASE_URL}/api/emprunts`).then((res) => res.json()),
  });

  const { data: utilisateurs } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: () =>
      fetch(`${BASE_URL}/api/utilisateurs`).then((res) => res.json()),
  });

  const { data: livres } = useQuery({
    queryKey: ["livres"],
    queryFn: () => fetch(`${BASE_URL}/api/livres`).then((res) => res.json()),
  });

  const cleanData = () => {
    setLivre("");
    setUtilisateur("");
    setDateemprunt("");
  };

  const addUser = useMutation({
    mutationFn: (postData) =>
      fetch(`${BASE_URL}/api/emprunts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }),
    onSuccess: (data) => {
      setSuccess("Emprunt ajouté avec succès.");
      cleanData();
      queryClient.invalidateQueries({ queryKey: ["emprunts"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      utilisateur.trim() !== "" &&
      livre.trim() !== "" &&
      dateemprunt.trim() !== ""
    ) {
      const data = {
        utilisateur_id: utilisateur,
        livre_id: livre,
        date_emprunt: dateemprunt,
      };

      addUser.mutate(data);
    }
  };

  const updateEmprunt = useMutation({
    mutationFn: (postData) =>
      fetch(`${BASE_URL}/api/emprunts/${postData.id}/retour`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData.data),
      }),
    onSuccess: (data) => {
      setSuccess("Livre rendu avec succès.");
      cleanData();
      queryClient.invalidateQueries({ queryKey: ["emprunts"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleRetournerLivre = async (id) => {
    if (window.confirm("Voulez-vous vraiment retourner ce livre ?")) {
      updateEmprunt.mutate({
        id: id,
        data: { date_retour: new Date().toISOString().split("T")[0] },
      });
    }
  };

  return (
    <main className={`${!showSidebar ? "main" : "main-full"} bg-slate-100`}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-bold text-3xl">Bibliothèque &gt; Emprunts</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 bg-[#014455] hover:bg-[#235766] text-white px-10 py-2 rounded-lg cursor-pointer"
        >
          <FaCirclePlus size={22} />
          <span>Nouvel emprunt</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-5">
        <div className="px-3 py-2 bg-white shadow-md rounded-lg border-l-4 border-[#014455] space-y-2">
          <h3 className="text-slate-400 text-lg">Total Emprunts</h3>
          <p className="text-3xl">{emprunts?.length}</p>
        </div>
        {/* <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">Emprunts actifs</h3>
          <p className="text-3xl">45</p>
        </div>
        <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">En retard</h3>
          <p className="text-3xl">5</p>
        </div> */}
        {/* <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">Perdus</h3>
          <p className="text-3xl">5</p>
        </div> */}
      </div>

      <div className="bg-white rounded-lg p-3 mt-6 overflow-x-auto shadow-lg">
        <div className="flex items-center justify-between gap-10">
          <input
            type="search"
            placeholder="Rechercher un livre..."
            className="flex-1 border border-slate-300 py-2 rounded-lg px-2"
          />

          <div className="flex items-center gap-4">
            <p>Afficher :</p>
            <div className="bg-white p-1 flex items-center gap-4 rounded-lg">
              <p className="rounded-lg bg-[#235766] text-white py-1.5 px-4 cursor-pointer">
                Tous
              </p>
              <p>Actifs</p>
              <p>Retards</p>
            </div>
          </div>
        </div>

        <table className="w-full min-w-[800px] mt-6">
          <thead>
            <tr className="text-gray-700 uppercase">
              <th className="text-start border-b border-slate-300">
                <div className="py-2">Livre</div>
              </th>
              <th className="text-start border-b border-slate-300">
                <div className="py-2">Utilisateurs</div>
              </th>
              <th className="text-start border-b border-slate-300">
                <div className="py-2">Date d'emprunt</div>
              </th>
              <th className="text-start border-b border-slate-300">
                <div className="py-2">Echéance</div>
              </th>
              <th className="text-center border-b border-slate-300">
                <div className="py-2">Statut</div>
              </th>
              <th className="text-end border-b border-slate-300">
                <div className="py-2">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {emprunts && emprunts?.length > 0 ? (
              emprunts.map((emprunt) => (
                <tr key={emprunt.id}>
                  <td className="border-b border-slate-300">
                    <div className="flex items-center gap-4 py-4 ">
                      <img
                        src={m1}
                        alt="Livre"
                        className="w-16 h-20 rounded-lg shadow-lg"
                      />
                      <div className="flex flex-col">
                        <h2 className="font-semibold text-lg">
                          {emprunt.livre_id}
                        </h2>
                        {/* <p className="text text-slate-500">Aurélien Géron</p>
                        <p className="text text-slate-500">2025</p> */}
                      </div>
                    </div>
                  </td>
                  <td className="text-start border-b border-slate-300">
                    <div className="py-4 ">
                      <h2>{emprunt.utilisateur_id}</h2>
                      {/* <p className="text-slate-400">897-ACE</p> */}
                    </div>
                  </td>
                  <td className="text-left border-b border-slate-300">
                    <div className="py-4 ">
                      <p>{emprunt.date_emprunt}</p>
                    </div>
                  </td>
                  <td className="text-left border-b border-slate-300">
                    <div className="py-4 ">
                      <p>{emprunt.date_retour}</p>
                    </div>
                  </td>
                  <td className="border-b border-slate-300">
                    <div className="py-4 ">
                      <p
                        className={clsx(
                          "text-nowrap text-center  px-3 py-0.5 rounded-full",
                          {
                            "text-red-700 bg-red-100":
                              emprunt.statut === "En cours",

                            "text-green-700 bg-green-200":
                              emprunt.statut === "Rendu",
                          },
                        )}
                      >
                        {emprunt.statut}
                      </p>
                    </div>
                  </td>
                  <td className="text-end border-b border-slate-300">
                    <div className="py-4 ">
                      <button
                        onClick={() => handleRetournerLivre(emprunt.id)}
                        className="rounded-lg py-2 px-4 bg-[#235766] text-white text-sm"
                      >
                        Retourner
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Aucun livre à afficher.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 inset-0 flex justify-center items-center bg-black/50"
          >
            <div className="w-[500px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] bg-white rounded-lg px-4 py-2">
              <div className="flex items-center justify-between gap-10 mb-10 border-b border-gray-200">
                <h1 className="text-lg font-semibold">AJOUT D'UN EMPRUNT</h1>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer p-1 rounded-full hover:bg-red-50"
                >
                  <FaXmark size={28} />
                </button>
              </div>

              <form
                className="flex flex-col gap-3 w-full"
                onSubmit={handleSubmit}
              >
                <div className="flex-1">
                  <label
                    htmlFor="utilisateur"
                    className="text-sm text-slate-500"
                  >
                    Utilisateur *
                  </label>
                  <select
                    id="utilisateur"
                    value={utilisateur}
                    onChange={(e) => setUtilisateur(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg"
                  >
                    <option value="">Selectionner un utilisateur</option>
                    {utilisateurs.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="livre" className="text-sm text-slate-500">
                    Livre *
                  </label>
                  <select
                    id="livre"
                    value={livre}
                    onChange={(e) => setLivre(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg"
                  >
                    <option value="">Selectionner un livre</option>
                    {livres.map((livre) => (
                      <option key={livre.id} value={livre.id}>
                        {livre.titre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="grid grid-cols-2 gap-4"> */}
                <div className="flex-1">
                  <label
                    htmlFor="emprunt-date"
                    className="text-sm text-slate-500"
                  >
                    Date d'emprunt
                  </label>
                  <input
                    type="date"
                    id="emprunt-date"
                    placeholder="Date d'emprunt"
                    className="p-2 rounded-lg border border-gray-200 w-full"
                    value={dateemprunt}
                    onChange={(e) => setDateemprunt(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-sm px-8 py-2 text-sm font-semibold active:scale-95 cursor-pointer transition-colors bg-[#014455] text-white hover:bg-[#235766]"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
};

export default Emprunts;
