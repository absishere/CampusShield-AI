import os
import shutil

def build_extension():
    # Define paths based on project structure
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    extension_dir = os.path.join(root_dir, 'extension')
    dashboard_public_dir = os.path.join(root_dir, 'dashboard', 'public')
    
    # Destination zip file path
    dist_zip = os.path.join(dashboard_public_dir, 'campusshield-extension')
    
    print(f"📦 Packaging extension from: {extension_dir}")
    print(f"🎯 Outputting to: {dist_zip}.zip")
    
    # Create the zip archive
    try:
        shutil.make_archive(dist_zip, 'zip', extension_dir)
        print("✅ Extension successfully compressed and copied to Dashboard public directory!")
    except Exception as e:
        print(f"❌ Failed to package extension: {e}")

if __name__ == "__main__":
    build_extension()
