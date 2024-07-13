import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoKatalog from './InfoKatalog';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import exportToCsv from '../../js/exportToCsv';
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Cookies from 'js-cookie';

const Katalog: React.FC = () => {
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState({
    box: '',
    bak: '',
    sparepart: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setcsvData] = useState({ row: [], column: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/api/posts`);

        setData(response.data);
        setQuantity({
          box: response.data.filter((katalog) => katalog.kategori == 'box').length,
          bak: response.data.filter((katalog) => katalog.kategori == 'bak').length,
          sparepart: response.data.filter((katalog) => katalog.kategori == 'sparepart').length
        });

        let column = Object.keys(response.data[0]);
        let row = [];
        response.data.forEach((res) => {
          row.push(Object.values(res));
        });

        setcsvData({ row, column });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={`${import.meta.env.VITE_API_BACKEND}/api/images/${product.images[0]}`}
        alt={product.images[0]}
        className="w-52 h-40 object-cover object-center rounded shadow-2 border-round"
      />
    );
  };

  const hargaTemplate = (product) => {
    return `Rp${Number(product.harga).toLocaleString('id-ID')}`;
  };

  const tanggalTemplate = (product) => {
    const date = new Date(product.updated_at);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
      timeZoneName: 'short'
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
  };

  const handleDeleteKatalog = (product) => {
    Swal.fire({
      text: `Hapus ${product.nama}?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get('access_token');
        await axios.delete(`${import.meta.env.VITE_API_BACKEND}/api/posts/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        Swal.fire('Sukses menghapus', '', 'success');
        location.reload();
      }
    });
  };
  const tombolAksiTemplate = (product) => {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={`${import.meta.env.VITE_API_CLIENT}/toko/katalog/${product.id}`}
          target="_blank"
          className="bg-green-500 text-sm text-white px-2 py-1 shadow rounded"
        >
          Lihat
        </a>
        <a
          href={`/edit-katalog/${product.id}`}
          className="bg-blue-800 text-sm text-white px-2 py-1 shadow rounded"
        >
          Edit
        </a>
        <a
          href="#"
          className="bg-red-500 text-sm text-white px-2 py-1 shadow rounded"
          onClick={() => handleDeleteKatalog(product)}
        >
          Hapus
        </a>
      </div>
    );
  };

  const header = (
    <div className="flex justify-between gap-2 items-center">
      <span className="text-xl text-900">Semua Barang</span>
      <button
        className="text-sm bg-blue-800 p-2 text-white rounded"
        onClick={() => exportToCsv('product.csv', [csvData.column, ...csvData.row])}
      >
        Download CSV
      </button>
    </div>
  );

  const stokTemplate = (product) => {
    return (
      <p
        className={`w-fit px-1 text-sm rounded font-bold ${
          product.stok < 5 ? 'bg-yellow-400' : 'bg-green-600 text-white'
        }`}
      >
        Sisa {product.stok}
      </p>
    );
  };

  return (
    <DefaultLayout>
      <InfoKatalog quantity={quantity} />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <DataTable
              value={data}
              header={header}
              paginator
              rows={10}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                field="gambar"
                header="Gambar"
                body={imageBodyTemplate}
                className="w-[30%]"
              ></Column>
              <Column field="nama" header="Nama" sortable className="w-[25%]"></Column>
              <Column field="kategori" header="Kategori" sortable></Column>
              <Column field="harga" header="Harga" body={hargaTemplate} sortable></Column>
              <Column field="stok" header="Stok" body={stokTemplate} sortable></Column>
              <Column
                field="updated_at"
                header="Update"
                body={tanggalTemplate}
                className="w-[25%]"
                sortable
              ></Column>
              <Column body={tombolAksiTemplate} header="Aksi"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Katalog;
