import AssetTable from '../components/AssetTable'
import NavMenu from '../components/NavMenu'

export default function AssetsPage() {
  return (
    <div>
        <NavMenu />
        <div className="container mx-auto p-4">
        <AssetTable />
        </div>
    </div>
  )
}