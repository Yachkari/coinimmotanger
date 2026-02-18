import ListingForm from "@/components/admin/ListingForm";

export const metadata = { title: "Nouvelle annonce" };

export default function NewListingPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Nouvelle annonce</h1>
        <p className="page-sub">Remplissez les informations puis ajoutez les photos</p>
      </div>

      <ListingForm />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap');
        .page { font-family: 'DM Sans', sans-serif; max-width: 900px; }
        .page-header { margin-bottom: 28px; }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 28px; color: #f0f0f0; margin-bottom: 4px; }
        .page-sub    { font-size: 14px; color: #555; }
      `}</style>
    </div>
  );
}