import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./signin.css";

const SignRevendeur = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    numero_telephone: "",
    email: "",
    Date_anniversaire: "",
    password: "",
    confirmPassword: "",
    devenirRevendeur: false,
    companyName: "",
    businessRegistration: "",
    taxIdentificationNumber: "",
    taxArticle: "",
    registrationNumber: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    const requiredFields = [
      "nom",
      "prenom",
      "adresse",
      "numero_telephone",
      "email",
      "Date_anniversaire",
      "password",
      "confirmPassword",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Ce champ est requis";
      }
    });

    // Vérification du numéro de téléphone
    if (
      formData.numero_telephone &&
      (isNaN(formData.numero_telephone) ||
        formData.numero_telephone.length !== 10)
    ) {
      newErrors.numero_telephone =
        "Le numéro de téléphone doit être un nombre de 10 chiffres";
    }

    // Vérification de l'email
    const emailPattern = /\S+@\S+\.\S+/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide";
    }

    // Vérification de la date de naissance
    const birthDate = new Date(formData.Date_anniversaire);
    const currentDate = new Date();
    if (birthDate >= currentDate) {
      newErrors.Date_anniversaire =
        "La date de naissance doit être antérieure à la date actuelle";
    }

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Si des erreurs sont trouvées, les définir et arrêter la soumission du formulaire
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si aucune erreur n'est trouvée, continuer avec la soumission du formulaire

    // Définir le type en fonction de l'option "Devenir Revendeur"
    const userType = formData.devenirRevendeur ? "Revendeur" : "Client";

    // Créer un nouvel objet FormData avec le type défini
    const formDataWithUserType = { ...formData, type: userType };

    // Envoyer la demande d'inscription au serveur
    try {
      const response = await fetch("http://localhost:3001/utilisateur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithUserType),
      });

      if (response.ok) {
        // Réinitialiser le formulaire après une inscription réussie
        setFormData({
          nom: "",
          prenom: "",
          adresse: "",
          numero_telephone: "",
          email: "",
          Date_anniversaire: "",
          password: "",
          confirmPassword: "",
          devenirRevendeur: false,
          companyName: "",
          businessRegistration: "",
          taxIdentificationNumber: "",
          taxArticle: "",
          registrationNumber: "",
          type: "",
        });
        setErrors({});
        setMessage("Inscription réussie!");
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Une erreur s'est produite lors de l'inscription.");
    }
  };

  return (
    <div className="sign">
      <div className="signup-page">
        <h2>Sign Up Client</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
            {errors.nom && <p>{errors.nom}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
            />
            {errors.prenom && <p>{errors.prenom}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
            {errors.adresse && <p>{errors.adresse}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="numero_telephone"
              value={formData.numero_telephone}
              onChange={handleChange}
            />
            {errors.numero_telephone && <p>{errors.numero_telephone}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Date of Birth</label>
            <input
              type="date"
              id="birthDate"
              name="Date_anniversaire"
              value={formData.Date_anniversaire}
              onChange={handleChange}
            />
            {errors.Date_anniversaire && <p>{errors.Date_anniversaire}</p>}
          </div>
          {/* Ajouter des champs pour le mot de passe et la confirmation du mot de passe */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            {errors.password && <p>{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
          {/* Option pour devenir revendeur */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="devenirRevendeur"
                checked={formData.devenirRevendeur}
                onChange={handleChange}
              />
              Become a reseller
            </label>
          </div>
          {/* Champs supplémentaires pour les revendeurs */}
          {formData.devenirRevendeur && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                {errors.companyName && <p>{errors.companyName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="businessRegistration">
                  Business Registration
                </label>
                <input
                  type="text"
                  id="businessRegistration"
                  name="businessRegistration"
                  value={formData.businessRegistration}
                  onChange={handleChange}
                />
                {errors.businessRegistration && (
                  <p>{errors.businessRegistration}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="taxIdentificationNumber">
                  Tax Identification Number
                </label>
                <input
                  type="text"
                  id="taxIdentificationNumber"
                  name="taxIdentificationNumber"
                  value={formData.taxIdentificationNumber}
                  onChange={handleChange}
                />
                {errors.taxIdentificationNumber && (
                  <p>{errors.taxIdentificationNumber}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="taxArticle">Tax Article</label>
                <input
                  type="text"
                  id="taxArticle"
                  name="taxArticle"
                  value={formData.taxArticle}
                  onChange={handleChange}
                />
                {errors.taxArticle && <p>{errors.taxArticle}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
                {errors.registrationNumber && (
                  <p>{errors.registrationNumber}</p>
                )}
              </div>
            </>
          )}

          <button className="botnn" type="submit">
            Sign Up
          </button>
        </form>
        <p className="ppp">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignRevendeur;
