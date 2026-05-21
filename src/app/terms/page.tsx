"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              Үйлчилгээний <em className="italic">нөхцөл</em>.
            </h1>
            <p className="text-[13px] text-white/35 mt-3">Сүүлд шинэчилсэн: 2026 оны 5-р сар</p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8 text-[15px] text-white/70 leading-relaxed">

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">1. Үйлчилгээний талаар</h2>
              <p>
                Khuslen нь насанд хүрэгчдэд зориулсан нийгмийн платформ юм. Платформыг ашигласнаар
                та энэхүү үйлчилгээний нөхцөлийг бүрэн хүлээн зөвшөөрч байна гэж үзнэ.
                Нөхцөлийг зөвшөөрөхгүй бол платформыг ашиглахаас татгалзана уу.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">2. Бүртгэлийн шаардлага</h2>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  <>Та <span className="text-white font-medium">18 ба түүнээс дээш</span> насны байх ёстой</>,
                  "Нэг хүн зөвхөн нэг аккаунт үүсгэх боломжтой",
                  "Бүртгэлийн мэдээлэл үнэн зөв байх ёстой",
                  "Нэвтрэх мэдээллээ нууцлах хариуцлагыг өөрөө хүлээнэ",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">3. Хориглосон үйлдлүүд</h2>
              <p className="mb-3">Дараах үйлдлүүд хатуу хориглоно:</p>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  "18 насанд хүрээгүй хүний зураг, контент байршуулах",
                  "Бусад хэрэглэгчийг дарамтлах, гомдоох, заналхийлэх",
                  "Хуурамч мэдээлэл, хуурамч профайл үүсгэх",
                  "Платформын системд халдах, вирус тарааx",
                  "Зар сурталчилгаа, спам мессеж илгээх",
                  "Бусдын зөвшөөрөлгүйгээр агуулгыг хуулж тараах",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">4. Гишүүнчлэл ба төлбөр</h2>
              <p className="mb-3">Зарим үйлчилгээ нь төлбөртэй гишүүнчлэл шаарддаг. Төлбөртэй холбоотой нөхцөлүүд:</p>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  "Бүх төлбөр QPay системээр хийгдэнэ",
                  "Гишүүнчлэл идэвхжсэн өдрөөс тооцно",
                  "Төлсөн хугацаа дуусмагц үйлчилгээ автоматаар зогсоно",
                  "Буцааж олгох бодлого: техникийн алдааны тохиолдолд 72 цагийн дотор холбоо барина уу",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">5. Агуулгын эрх</h2>
              <p>
                Та платформд байршуулсан агуулгынхаа эрхийг өөртөө хадгална. Гэсэн хэдий ч
                байршуулснаар та Khuslen-д тухайн агуулгыг платформын хүрээнд үзүүлэх,
                хуваалцах зөвшөөрлийг олгосон гэж үзнэ. Хориотой агуулгыг
                урьдчилан мэдэгдэлгүйгээр устгах эрхийг бид хадгална.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">6. Аккаунт түдгэлзүүлэх</h2>
              <p className="mb-3">
                Дараах тохиолдолд таны аккаунтыг урьдчилан мэдэгдэлгүйгээр түдгэлзүүлэх
                эсвэл бүрмөсөн устгах эрхтэй:
              </p>
              <ul className="flex flex-col gap-2.5 pl-1">
                {[
                  "Үйлчилгээний нөхцөл зөрчсөн",
                  "Бусад хэрэглэгчдэд хохирол учруулсан",
                  "Хуулийн байгууллагын шаардлага гарсан",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">7. Хариуцлагын хязгаарлалт</h2>
              <p>
                Khuslen платформ нь хэрэглэгчдийн хоорондын харилцааны улмаас үүссэн
                аливаа хохирол, маргааны хариуцлагыг хүлээхгүй. Платформ нь зуучлагчийн
                үүрэг гүйцэтгэх бөгөөд хэрэглэгч бүр өөрийн үйлдлийн хариуцлагыг хувиараа хүлээнэ.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">8. Нөхцөл өөрчлөлт</h2>
              <p>
                Бид үйлчилгээний нөхцөлийг цаг үе тутам шинэчилж болно. Томоохон өөрчлөлт гарвал
                платформ дотор мэдэгдэл өгнө. Өөрчлөлтийн дараа платформыг үргэлжлүүлэн
                ашигласнаар та шинэ нөхцөлийг зөвшөөрсөн гэж үзнэ.
              </p>
            </section>

            <section className="pt-6 border-t border-white/[0.07]">
              <h2 className="text-[17px] font-semibold text-white mb-3">9. Холбоо барих</h2>
              <p>
                Асуулт, гомдол байвал{" "}
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
            <Link href="/privacy" className="text-white/45 hover:text-white/70 transition-colors">
              Нууцлалын бодлого →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
