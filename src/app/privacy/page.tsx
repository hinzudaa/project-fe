"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed video background */}
      <div className="fixed inset-0 z-0">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Top bar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-[820px] mx-auto">
          <button
            onClick={() => router.back()}
            className="liquid-glass rounded-full pl-3 pr-5 py-2 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Буцах</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-[820px] mx-auto px-6 pb-16">
        <div className="liquid-glass-card rounded-[28px] p-8 md:p-12">

          {/* Heading */}
          <div className="mb-10">
            <h1
              className="text-4xl md:text-5xl text-white mb-2 tracking-tight leading-[1.05]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Нууцлалын <em className="italic">бодлого</em>.
            </h1>
            <p className="text-[13px] text-white/35 mt-3">Сүүлд шинэчилсэн: 2026 оны 5-р сар</p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8 text-[15px] text-white/70 leading-relaxed">

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">1. Ерөнхий мэдээлэл</h2>
              <p>
                Khuslen платформ нь таны хувийн мэдээллийг хуулийн дагуу цуглуулж, хадгалж, ашигладаг.
                Энэхүү нууцлалын бодлого нь бид таны мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалдаг талаар тайлбарласан болно.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">2. Цуглуулдаг мэдээлэл</h2>
              <p className="mb-3">Бид дараах мэдээллийг цуглуулдаг:</p>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  "Нэр, утасны дугаар, хүйс — бүртгэлийн үед",
                  "Профайл зураг, намтар — хэрэглэгч өөрөө оруулсан тохиолдолд",
                  "Платформ дотор хийсэн үйлдлүүд (like, swipe, мессеж)",
                  "Төлбөрийн мэдээлэл — QPay-аар дамжсан гүйлгээний бүртгэл",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">3. Мэдээллийг ашиглах зорилго</h2>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  "Таны аккаунтыг удирдах, хамгаалах",
                  "Платформын үйлчилгээг хангах, сайжруулах",
                  "Төлбөрийн гүйлгээг боловсруулах",
                  "Хэрэглэгчдийн аюулгүй байдлыг хангах",
                  "Хууль эрх зүйн үүргээ биелүүлэх",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">4. Мэдээлэл хуваалцах</h2>
              <p>
                Бид таны хувийн мэдээллийг гуравдагч этгээдэд зарах, худалдаалах, шилжүүлдэггүй болно.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">5. Мэдээллийн аюулгүй байдал</h2>
              <p>
                Таны мэдээллийг хамгаалахын тулд бид шифрлэлт, нэвтрэх хяналт, аюулгүй серверийн дэд бүтэц ашигладаг.
                Гэсэн хэдий ч интернетэд дамжуулах бүрэн аюулгүй байдлыг баталгаажуулах боломжгүй тул
                таны нууц үгийг найдвартай хадгалах хариуцлагыг өөрөө хүлээнэ.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">6. Насны хязгаарлалт</h2>
              <p>
                Khuslen платформ нь зөвхөн{" "}
                <span className="text-white font-medium">18 ба түүнээс дээш насны хүмүүст</span>{" "}
                зориулагдсан. 18 насанд хүрээгүй хүн бүртгүүлэх эрхгүй бөгөөд бид ийм хэрэглэгчийн
                аккаунтыг илрүүлсэн тохиолдолд нэн даруй устгах эрхтэй.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">7. Хэрэглэгчийн эрх</h2>
              <ul className="flex flex-col gap-2.5 pl-1 mb-3">
                {[
                  "Өөрийн мэдээллийг харах, шинэчлэх",
                  "Аккаунтаа устгуулахыг хүсэх",
                  "Мэдэгдэл, зар сурталчилгааг цуцлах",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>Эдгээр эрхтэй холбоотой хүсэлтийг support@khuslen.mn хаягаар илгээнэ үү.</p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">8. Холбоо барих</h2>
              <p>
                Нууцлалын бодлоготой холбоотой асуулт, санал гомдол байвал{" "}
                <a href="mailto:support@khuslen.mn" className="text-white/80 hover:text-white underline underline-offset-2 transition-colors">
                  support@khuslen.mn
                </a>{" "}
                хаягаар холбогдоно уу.
              </p>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/30">
            <span>© 2026 Khuslen. Бүх эрх хуулиар хамгаалагдсан.</span>
            <Link href="/terms" className="text-white/45 hover:text-white/70 transition-colors">
              Үйлчилгээний нөхцөл →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
