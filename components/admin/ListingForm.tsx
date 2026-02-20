"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Listing, CreateListingPayload } from "@/types";
import { CITIES, getNeighborhoods } from "@/constants/cities";
import { AMENITIES } from "@/constants/amenities";
import { TYPE_OPTIONS, PURPOSE_OPTIONS } from "@/constants/filters";
import { buildListingSlug } from "@/lib/slugify";
import ImageUploader from "@/components/admin/ImageUploader";

interface Props {
  listing?: Listing;
}

const EMPTY: Partial<CreateListingPayload> = {
  title:             "",
  description:       "",
  type:              "appartement",
  purpose:           "vente",
  status:            "disponible",
  price:             0,
  price_period:      null,
  surface:           null,
  rooms:             null,
  bedrooms:          null,
  bathrooms:         null,
  floor:             null,
  city:              "",
  neighborhood:      null,
  address:           null,
  amenities:         [],
  is_featured:       false,
  cover_image_index: 0,
  meta_title:        null,
  meta_description:  null,
};

export default function ListingForm({ listing }: Props) {
  const router = useRouter();
  const isEdit = !!listing;

  const [form,    setForm]    = useState<Partial<CreateListingPayload>>(
    isEdit ? { ...listing } : { ...EMPTY }
  );
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // savedId tracks the ID once created — switches form to update mode
  const [savedId, setSavedId] = useState<string | null>(listing?.id ?? null);
  const [savedSlug, setSavedSlug] = useState<string | null>(listing?.slug ?? null);

  const set = (key: keyof CreateListingPayload, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const neighborhoods = form.city ? getNeighborhoods(form.city) : [];

  function toggleAmenity(key: string) {
    const current = form.amenities ?? [];
    set(
      "amenities",
      current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key]
    );
  }

  // ── Submit ───────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = { ...form } as CreateListingPayload;

      // Determine if we're creating or updating
      // savedId is set after first successful create → always PUT after that
      const effectiveId = isEdit ? listing!.id : savedId;
      const isUpdate    = !!effectiveId;

      if (!isUpdate) {
        // First time creating — generate slug
        payload.slug = buildListingSlug(
          payload.type,
          payload.city,
          payload.neighborhood,
          payload.purpose
        );
      } else {
        // Updating — preserve the original slug so it never changes
        if (savedSlug) payload.slug = savedSlug;
      }

      const url    = isUpdate ? `/api/listings/${effectiveId}` : "/api/listings";
      const method = isUpdate ? "PUT" : "POST";

      // Strip relational/readonly fields before PUT
      const { listing_images, created_at, updated_at, ...cleanPayload } = payload as any;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type":  "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN!,
        },
        body: JSON.stringify(isUpdate ? cleanPayload : payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        return;
      }

      if (!isUpdate) {
        // Just created — store id + slug, switch to update mode
        setSavedId(data.id);
        setSavedSlug(data.slug);
        setSuccess("Annonce créée ! Ajoutez des photos ci-dessous.");
      } else {
        setSuccess("Modifications enregistrées !");
        if (isEdit) router.refresh();
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  // Whether the listing exists (created or in edit mode)
  const listingExists = isEdit || !!savedId;

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="lf-root">
      <form onSubmit={handleSubmit} className="lf-form">

        {/* ── Core info ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Informations principales</h2>

          <div className="lf-field full">
            <label className="lf-label">Titre de l'annonce *</label>
            <input
              className="lf-input"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Villa moderne avec piscine à Malabata"
              required
            />
          </div>

          <div className="lf-row">
            <div className="lf-field">
              <label className="lf-label">Type de bien *</label>
              <select className="lf-input" value={form.type} onChange={(e) => set("type", e.target.value)} required>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="lf-field">
              <label className="lf-label">Objectif *</label>
              <select
                className="lf-input"
                value={form.purpose}
                onChange={(e) => {
                  set("purpose", e.target.value);
                  if (e.target.value === "vente")    set("price_period", null);
                  if (e.target.value === "location") set("price_period", "mois");
                  if (e.target.value === "vacances") set("price_period", "nuit");
                }}
                required
              >
                {PURPOSE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="lf-field">
              <label className="lf-label">Statut</label>
              <select className="lf-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="vendu">Vendu</option>
                <option value="loue">Loué</option>
                <option value="reserve">Réservé</option>
              </select>
            </div>
          </div>

          <div className="lf-field full">
            <label className="lf-label">Description</label>
            <textarea
              className="lf-input lf-textarea"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Décrivez le bien en détail : emplacement, état, points forts..."
              rows={5}
            />
          </div>
        </section>

        {/* ── Prix ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Prix</h2>
          <div className="lf-row">
            <div className="lf-field">
              <label className="lf-label">Prix (MAD) *</label>
              <input
                type="number" className="lf-input"
                value={form.price ?? ""}
                onChange={(e) => set("price", Number(e.target.value))}
                placeholder="1 200 000" min={0} required
              />
            </div>
            {form.purpose !== "vente" && (
              <div className="lf-field">
                <label className="lf-label">Période</label>
                <select className="lf-input" value={form.price_period ?? ""} onChange={(e) => set("price_period", e.target.value || null)}>
                  <option value="nuit">Par nuit</option>
                  <option value="semaine">Par semaine</option>
                  <option value="mois">Par mois</option>
                </select>
              </div>
            )}
          </div>
        </section>

        {/* ── Caractéristiques ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Caractéristiques</h2>
          <div className="lf-row lf-row-5">
            {[
              { key: "surface",   label: "Surface (m²)", placeholder: "110" },
              { key: "rooms",     label: "Pièces",        placeholder: "4"   },
              { key: "bedrooms",  label: "Chambres",      placeholder: "3"   },
              { key: "bathrooms", label: "Salles de bain",placeholder: "2"   },
              { key: "floor",     label: "Étage",         placeholder: "0"   },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="lf-field">
                <label className="lf-label">{label}</label>
                <input
                  type="number" className="lf-input"
                  value={(form as Record<string, unknown>)[key] as number ?? ""}
                  onChange={(e) => set(key as keyof CreateListingPayload, e.target.value ? Number(e.target.value) : null)}
                  placeholder={placeholder} min={0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Localisation ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Localisation</h2>
          <div className="lf-row">
            <div className="lf-field">
              <label className="lf-label">Ville *</label>
              <select
                className="lf-input" value={form.city ?? ""}
                onChange={(e) => { set("city", e.target.value); set("neighborhood", null); }}
                required
              >
                <option value="">Choisir une ville</option>
                {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="lf-field">
              <label className="lf-label">Quartier</label>
              <select
                className="lf-input" value={form.neighborhood ?? ""}
                onChange={(e) => set("neighborhood", e.target.value || null)}
                disabled={!form.city}
              >
                <option value="">Choisir un quartier</option>
                {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="lf-field full">
            <label className="lf-label">Adresse complète</label>
            <input
              className="lf-input" value={form.address ?? ""}
              onChange={(e) => set("address", e.target.value || null)}
              placeholder="Rue, numéro..."
            />
          </div>
        </section>

        {/* ── Équipements ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Équipements & Commodités</h2>
          <div className="amenities-grid">
            {AMENITIES.map(({ key, label }) => {
              const active = (form.amenities ?? []).includes(key);
              return (
                <button
                  key={key} type="button"
                  onClick={() => toggleAmenity(key)}
                  className={`amenity-chip ${active ? "active" : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Affichage ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">Affichage</h2>
          <label className="lf-toggle">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => set("is_featured", e.target.checked)} />
            <span className="toggle-track" />
            <span className="toggle-label">Mettre en vedette sur la page d'accueil</span>
          </label>
        </section>

        {/* ── SEO ── */}
        <section className="lf-section">
          <h2 className="lf-section-title">SEO <span className="optional">(optionnel)</span></h2>
          <p className="lf-hint">Laissez vide pour une génération automatique depuis les données du bien.</p>
          <div className="lf-field full">
            <label className="lf-label">Titre SEO</label>
            <input className="lf-input" value={form.meta_title ?? ""} onChange={(e) => set("meta_title", e.target.value || null)} placeholder="Titre personnalisé pour Google (60 caractères max)" maxLength={60} />
          </div>
          <div className="lf-field full">
            <label className="lf-label">Description SEO</label>
            <textarea className="lf-input" value={form.meta_description ?? ""} onChange={(e) => set("meta_description", e.target.value || null)} placeholder="Description pour Google (160 caractères max)" maxLength={160} rows={3} />
          </div>
        </section>

        {/* ── Feedback & submit ── */}
        {error   && <div className="lf-error">⚠ {error}</div>}
        {success && <div className="lf-success">✓ {success}</div>}

        <div className="lf-actions">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            Annuler
          </button>
          <button type="submit" className="btn-gold" disabled={saving}>
            {saving
              ? "Enregistrement…"
              : listingExists
                ? "Enregistrer les modifications"
                : "Créer l'annonce"}
          </button>
        </div>
      </form>

      {/* Photos — only shown once listing exists */}
      {savedId && (
        <div className="lf-section" style={{ marginTop: 32 }}>
          <h2 className="lf-section-title">Photos</h2>
          <ImageUploader listingId={savedId} existingImages={listing?.listing_images ?? []} />
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600&family=Playfair+Display:wght@600&display=swap');

        .lf-root { font-family: 'DM Sans', sans-serif; max-width: 860px; }
        .lf-form { display: flex; flex-direction: column; gap: 8px; }

        .lf-section {
          background: #141414; border: 1px solid #1f1f1f;
          border-radius: 12px; padding: 28px; margin-bottom: 16px;
        }
        .lf-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; color: #d0d0d0; margin-bottom: 20px;
          padding-bottom: 12px; border-bottom: 1px solid #1f1f1f;
        }
        .optional { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #555; font-weight: 400; }
        .lf-hint  { font-size: 12px; color: #555; margin-top: -12px; margin-bottom: 16px; }

        .lf-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 16px; }
        .lf-row-5 { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }

        .lf-field { display: flex; flex-direction: column; gap: 7px; }
        .lf-field.full { grid-column: 1 / -1; margin-bottom: 16px; }

        .lf-label { font-size: 11px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 0.06em; }

        .lf-input {
          background: #0f0f0f; border: 1px solid #2a2a2a;
          border-radius: 8px; padding: 11px 13px;
          font-size: 14px; color: #e0e0e0;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.15s ease; width: 100%;
        }
        .lf-input::placeholder { color: #333; }
        .lf-input:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.07); }
        .lf-input:disabled { opacity: 0.4; cursor: not-allowed; }
        .lf-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

        .amenities-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .amenity-chip {
          padding: 7px 14px; border-radius: 20px; font-size: 12px;
          font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.15s ease;
          background: #0f0f0f; border: 1px solid #2a2a2a; color: #777;
        }
        .amenity-chip:hover  { border-color: #c9a84c; color: #c9a84c; }
        .amenity-chip.active { background: rgba(201,168,76,0.12); border-color: #c9a84c; color: #c9a84c; }

        .lf-toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .lf-toggle input { display: none; }
        .toggle-track {
          width: 40px; height: 22px; border-radius: 11px;
          background: #2a2a2a; position: relative; flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .toggle-track::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #555; transition: all 0.2s ease;
        }
        .lf-toggle input:checked ~ .toggle-track { background: #c9a84c; }
        .lf-toggle input:checked ~ .toggle-track::after { transform: translateX(18px); background: #0a0a0a; }
        .toggle-label { font-size: 14px; color: #c0c0c0; }

        .lf-error   { background: rgba(224,82,82,0.1); border: 1px solid rgba(224,82,82,0.25); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #e05252; }
        .lf-success { background: rgba(76,175,130,0.1); border: 1px solid rgba(76,175,130,0.25); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #4caf82; }

        .lf-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
        .btn-ghost {
          background: none; border: 1px solid #2a2a2a; color: #888;
          padding: 11px 20px; border-radius: 8px; font-size: 14px;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s ease;
        }
        .btn-ghost:hover { border-color: #444; color: #c0c0c0; }
        .btn-gold {
          background: #c9a84c; color: #0a0a0a; border: none;
          padding: 11px 24px; border-radius: 8px; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s ease;
        }
        .btn-gold:hover:not(:disabled) { background: #d4b45a; transform: translateY(-1px); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}