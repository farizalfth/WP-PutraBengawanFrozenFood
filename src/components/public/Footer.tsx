import { STORE_NAME } from '../../utils/constants'

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="border-t border-white/10">
        <div className="container-site py-5 text-center text-xs opacity-80">
          <p>© 2026 {STORE_NAME} Frozen Food. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer